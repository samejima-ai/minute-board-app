import asyncio
import json
import logging
import os
import sys
from datetime import datetime

from dotenv import load_dotenv

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load env
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from backend.services.gemini_service import GeminiService

# Setup Logging
log_dir = os.path.join(os.path.dirname(__file__), "../logs")
os.makedirs(log_dir, exist_ok=True)
timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
log_file = os.path.join(log_dir, f"scenario_test_{timestamp}.log")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler(log_file, encoding="utf-8"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("ScenarioTest")

# Define Scenario (Example)
SCENARIO = [
    {
        "step": 1,
        "input": "来週の火曜日に定例会議を設定したいのですが。",
        "expected_type": "PROPOSAL"
    },
    {
        "step": 2,
        "input": "参加者は全員必須でお願いします。",
        "expected_type": "INFO"
    },
    {
        "step": 3,
        "input": "あ、やっぱり時間は14時からで。",
        "expected_type": "PROPOSAL" # Update or New Proposal
    }
]

async def run_scenario():
    logger.info("Starting Scenario Test...")
    service = GeminiService()
    
    current_themes = [] # Mock Context
    
    for item in SCENARIO:
        logger.info(f"\n--- Step {item['step']} ---")
        logger.info(f"Input: {item['input']}")
        
        # Call Service
        # Note: GeminiService.organize_text is synchronous in current implementation
        # If it becomes async, use await.
        result = service.organize_text(item['input'], current_themes)
        
        if "error" in result:
            logger.error(f"Error: {result['error']}")
            continue
            
        commands = result.get("commands", [])
        raw_response = result.get("raw_response", "")
        
        logger.info(f"Commands: {json.dumps(commands, ensure_ascii=False, indent=2)}")
        
        # Update Mock Context (Accumulate Summaries)
        for cmd in commands:
            if cmd["action"] == "add_note":
                args = cmd["args"]
                current_themes.append(f"{args.get('summary', '')}: {args.get('content', '')}")
                
        # Wait a bit to avoid rate limits if running fast
        await asyncio.sleep(1)

    logger.info("\nScenario Test Completed.")
    logger.info(f"Log saved to: {log_file}")

if __name__ == "__main__":
    asyncio.run(run_scenario())
