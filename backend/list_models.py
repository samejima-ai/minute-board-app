
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Error: GOOGLE_API_KEY not found.")
    exit(1)

genai.configure(api_key=api_key)

try:
    with open("backend/models_list_utf8.txt", "w", encoding="utf-8") as f:
        f.write("Listing available models...\n")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                f.write(f"- {m.name} (Display: {m.display_name})\n")
    print("Done writing to backend/models_list_utf8.txt")
except Exception as e:
    print(f"Error listing models: {e}")
