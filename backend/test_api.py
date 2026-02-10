import requests
import json
import time

def test_organize_endpoint():
    url = "http://localhost:8000/api/organize"
    payload = {
        "text": "明日の10時からマーケティング会議があります。あと、洗剤を買わないといけない。",
        "current_themes": ["Work", "Private"]
    }
    headers = {"Content-Type": "application/json"}

    print(f"Sending request to {url}...")
    print(f"Payload: {json.dumps(payload, ensure_ascii=False)}")

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        print(f"Status Code: {response.status_code}")
        print("Response JSON:")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
        
        data = response.json()
        if "commands" in data:
            print("✅ Test Passed: 'commands' field found in response.")
        else:
            print("❌ Test Failed: 'commands' field missing.")

    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the server running?")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Wait a bit for server to likely start if run immediately after
    test_organize_endpoint()
