import os
import json
import logging
import google.generativeai as genai
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.is_ready = False
        
        if not self.api_key:
            logger.warning("GOOGLE_API_KEY is not set. Gemini Service will fail.")
        else:
            try:
                genai.configure(api_key=self.api_key)
                self.is_ready = True
            except Exception as e:
                logger.error(f"Failed to configure Gemini API: {e}")
        
        # Use a stable model as default
        self.model_name = "gemini-2.0-flash" 
        self.fallback_model_name = "gemini-1.5-flash"
        
        self._load_system_prompt()

    def _load_system_prompt(self):
        try:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            prompt_path = os.path.join(current_dir, "../prompts/backend_logic.md")
            
            if os.path.exists(prompt_path):
                with open(prompt_path, "r", encoding="utf-8") as f:
                    self.system_prompt = f.read()
            else:
                logger.warning(f"System prompt not found at {prompt_path}, using default.")
                self.system_prompt = "You are a helpful assistant. Output JSON commands."
        except Exception as e:
            logger.error(f"Failed to load system prompt: {e}")
            self.system_prompt = "You are a helpful assistant. Output JSON."

    def organize_text(self, text: str, current_themes: List[str] = None) -> Dict[str, Any]:
        """
        Sends the text and current context to Gemini to structure it into commands.
        Returns a dict with 'commands' (List) and 'raw_response' (str).
        """
        if current_themes is None:
            current_themes = []

        if not self.is_ready:
             logger.error("GeminiService is not ready (missing API key or config failed)")
             return {"error": "API Key missing or Config Failed", "commands": []}

        try:
            model = genai.GenerativeModel(self.model_name)
            
            # Construct the user message
            user_message = f"""
Input Text: "{text}"
Current Themes: {json.dumps(current_themes, ensure_ascii=False)}
            """

            # Combine system prompt
            model = genai.GenerativeModel(
                model_name=self.model_name,
                system_instruction=self.system_prompt
            )
            
            response = model.generate_content(
                user_message,
                generation_config={"response_mime_type": "application/json"}
            )
            
            response_text = response.text
            
            # DEBUG LOGGING (Safe)
            try:
                log_path = r"C:\Users\Owner\CDD-Guideline\backend_debug.log"
                with open(log_path, "a", encoding="utf-8") as f:
                    f.write(f"\n--- Input: {text} ---\n")
                    f.write(f"Raw Response: {response_text}\n")
            except Exception:
                pass

            return {
                "commands": self._clean_and_parse_json(response_text).get("commands", []),
                "raw_response": response_text
            }

        except Exception as e:
            logger.error(f"Gemini API Error: {e}")
            return {"error": str(e), "commands": [], "raw_response": str(e)}

    def _clean_and_parse_json(self, response_text: str) -> Dict[str, Any]:
        """
        Cleans markdown fencing if present and parses JSON.
        """
        try:
            cleaned_text = response_text.strip()
            if cleaned_text.startswith("```json"):
                cleaned_text = cleaned_text[7:]
            if cleaned_text.startswith("```"):
                cleaned_text = cleaned_text[3:]
            if cleaned_text.endswith("```"):
                cleaned_text = cleaned_text[:-3]
            
            parsed = json.loads(cleaned_text.strip())
            if not isinstance(parsed, dict):
                 # Try to wrap if it's a list
                 if isinstance(parsed, list):
                     return {"commands": parsed}
                 return {"commands": []}
            return parsed
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error: {e}, Raw text: {response_text}")
            return {"commands": []}
