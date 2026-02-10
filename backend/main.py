import os
import sys
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Union
from enum import Enum
import logging
import time

# Load env variables
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, ".env")
load_dotenv(dotenv_path=env_path)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import Service
try:
    from backend.services.gemini_service import GeminiService
except ImportError as e:
    logger.error(f"Failed to import GeminiService: {e}")
    sys.exit(1)

app = FastAPI(title="Voice Memo Backend")

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services
try:
    gemini_service = GeminiService()
except Exception as e:
    logger.error(f"Failed to initialize GeminiService: {e}")
    # Continue startup but service might be degraded
    gemini_service = None

# Data Models
class ActionType(str, Enum):
    ADD_NOTE = "add_note"
    UPDATE_GRAPH = "update_graph"
    UNKNOWN = "unknown"

class CommandArgs(BaseModel):
    summary: str = Field(..., description="カードのタイトル")
    content: str = Field(..., description="カードの詳細内容")
    keywords: List[str] = Field(default_factory=list)
    importance: float = Field(0.5, ge=0.0, le=1.0)
    type: str = "INFO"

class Command(BaseModel):
    action: ActionType
    args: Union[CommandArgs, Dict[str, Any]]
    original_text: Optional[str] = None

class OrganizeRequest(BaseModel):
    text: str
    current_themes: List[str] = []

class OrganizeResponse(BaseModel):
    commands: List[Command]
    raw_response: Optional[str] = None
    processing_time: Optional[float] = None

# Endpoints
@app.post("/api/organize", response_model=OrganizeResponse)
async def organize(request: OrganizeRequest):
    start_time = time.time()
    logger.info(f"Received organize request: {request.text}")
    
    if not gemini_service:
        logger.error("GeminiService is not available")
        return OrganizeResponse(commands=[], raw_response="Service Unavailable")

    result = gemini_service.organize_text(request.text, request.current_themes)
    
    processing_time = time.time() - start_time
    
    if "error" in result:
        logger.error(f"Service error: {result['error']}")
        return OrganizeResponse(
            commands=[], 
            raw_response=f"Error: {result.get('error')}",
            processing_time=processing_time
        )

    # Convert raw dicts to Command models
    # This might raise validation error if LLM output is very bad, 
    # but that's what we want to catch or handle.
    # For now, we trust Pydantic to filter/validate.
    
    raw_commands = result.get("commands", [])
    valid_commands = []
    
    for cmd in raw_commands:
        try:
            # Flexible validation
            if "action" not in cmd:
                cmd["action"] = "unknown"
            
            # Map string action to Enum if possible, else unknown
            try:
                ActionType(cmd["action"])
            except ValueError:
                cmd["action"] = "unknown"
                
            valid_commands.append(Command(**cmd))
        except Exception as e:
            logger.warning(f"Skipping invalid command: {cmd} - {e}")

    return OrganizeResponse(
        commands=valid_commands,
        raw_response=result.get("raw_response"),
        processing_time=processing_time
    )

@app.get("/health")
async def health_check():
    return {"status": "ok", "service_ready": gemini_service is not None}

if __name__ == "__main__":
    import uvicorn
    try:
        # Port 8000 is standard, allow 127.0.0.1 for windows localhost
        host = "127.0.0.1"
        port = 8000
        logger.info(f"Starting server at http://{host}:{port}")
        uvicorn.run(app, host=host, port=port)
    except Exception as e:
        logger.critical(f"Server failed to start: {e}")
        sys.exit(1)
