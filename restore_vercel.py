import urllib.request
import json
import os

# WARNING: Token and deploy_id removed for security
# Store these in environment variables or .env file instead
token = os.getenv("VERCEL_TOKEN", "")
deploy_id = os.getenv("VERCEL_DEPLOY_ID", "")
headers = {"Authorization": f"Bearer {token}"}

try:
    req = urllib.request.Request(f"https://api.vercel.com/v6/deployments/{deploy_id}/files", headers=headers)
    with urllib.request.urlopen(req) as response:
        files = json.loads(response.read().decode())

    for f in files:
        name = f.get('name', '')
        if name in ['src/components/layout/WhatsAppFloat.jsx', 'src/components/home/TrustBar.jsx']:
            uid = f.get('uid')
            print(f"Downloading {name}...")
            file_req = urllib.request.Request(f"https://api.vercel.com/v7/deployments/{deploy_id}/files/{uid}", headers=headers)
            with urllib.request.urlopen(file_req) as file_res:
                content = file_res.read()
                # Ensure directory exists
                os.makedirs(os.path.dirname(name), exist_ok=True)
                with open(name, 'wb') as out:
                    out.write(content)
            print(f"Restored {name}")
except Exception as e:
    print(f"Error: {e}")
