
import os
import sys

print("Hello from debug script")
try:
    import requests
    print("Requests imported")
    from dotenv import load_dotenv
    print("Dotenv imported")
    import supabase
    print("Supabase imported")
except Exception as e:
    print(f"Import Error: {e}")

try:
    # Try importing local modules
    sys.path.append(os.path.join(os.getcwd(), 'backend'))
    import statsedge_daily_agent
    print("Agent module imported")
except Exception as e:
    print(f"Agent Import Error: {e}")
