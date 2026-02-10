import urllib.request
import json

url = "http://127.0.0.1:8000/api/organize"
data = {
    "text": "テスト: 次の会議は来週の火曜日に設定しましょう。",
    "current_themes": []
}

req = urllib.request.Request(url)
req.add_header('Content-Type', 'application/json')
jsondata = json.dumps(data).encode('utf-8')
req.add_header('Content-Length', len(jsondata))

try:
    response = urllib.request.urlopen(req, jsondata)
    print(f"Status: {response.getcode()}")
    print(f"Response: {response.read().decode('utf-8')}")
except urllib.error.HTTPError as e:
    print(f"Status: {e.code}")
    print(f"Error: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
