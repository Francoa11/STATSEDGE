
from sportmonks_service import SportmonksService
import json
from dotenv import load_dotenv
import os

load_dotenv()

def test_api():
    print(f"Testing with Key: {os.getenv('SPORTMONKS_API_KEY')[:5]}...")
    service = SportmonksService()
    # Try getting livescores (might be empty if no games) or just a standard endpoint
    try:
        # Check standard endpoint for robustness if livescores returns empty
        data = service.get_live_scores()
        print("Response received.")
        if 'error' in data:
            print("Error:", data['error'])
        else:
            print(f"Data keys: {data.keys()}")
            # Print a snippet to verify structure
            print(json.dumps(data, indent=2)[:500])
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_api()
