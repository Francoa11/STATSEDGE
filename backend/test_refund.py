import requests
import uuid
import time
import sys

def run_simulation():
    # Random User UUID for testing
    user_id = str(uuid.uuid4())
    url = "http://localhost:8000/process-result"

    print(f"--- Starting Daily Gold Pick Insurance Simulation ---")
    print(f"Target User ID: {user_id}")
    print(f"Scenario: User bets $15 on a Daily Gold Pick and LOSES.")
    print(f"Expectation: System should issue a refund of $15.")
    
    payload = {
        "user_id": user_id,
        "bet_amount": 15.0,
        "status": "LOST", # Simulating a Loss
        "is_daily_gold_pick": True 
    }

    print(f"\nSending POST request to {url}...")
    try:
        response = requests.post(url, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("\nResponse Received:")
            print(f"Action: {data.get('action')}")
            print(f"Refund Amount: ${data.get('amount')}")
            print(f"Reason: {data.get('reason')}")
            
            if data.get('action') == "REFUND_ISSUED" and data.get('amount') == 15.0:
                 print("\n✅ SUCCESS: Insurance logic triggered correctly.")
            else:
                 print("\n❌ FAILURE: Refund was not issued as expected.")
        else:
            print(f"\n❌ Error: Server returned status code {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ FATAL: Could not connect to backend server. Is 'main.py' running?")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")

if __name__ == "__main__":
    # Small delay to ensure server has time to start if run consecutively
    time.sleep(2)
    run_simulation()
