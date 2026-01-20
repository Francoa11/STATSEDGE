import os
from supabase import create_client, Client
from typing import Dict, Any, Optional

# Load env if not already loaded (though usually loaded in main)
from dotenv import load_dotenv
load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    print("Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not set in environment.")
    # Safe fallback to prevent immediate crash on import, 
    # but requests will fail if not configured.
    url = url or "https://placeholder.supabase.co" 
    key = key or "placeholder_key"

supabase: Client = create_client(url, key)

def get_user_profile(user_id: str) -> Dict[str, Any]:
    """Fetch user profile from 'profiles' table."""
    try:
        response = supabase.table("profiles").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data else {}
    except Exception as e:
        print(f"Error fetching profile: {e}")
        return {}

def update_wallet_balance(user_id: str, new_balance: float):
    """Updates the wallet balance. Realtime subscribers on frontend will be notified automatically via Postgres Changes."""
    try:
        supabase.table("wallets").update({"balance": new_balance}).eq("user_id", user_id).execute()
    except Exception as e:
        print(f"Error updating wallet: {e}")

def add_credit_transaction(wallet_id: str, amount: float, reason: str, description: str):
    """Logs a transaction in 'credits' table."""
    data = {
        "wallet_id": wallet_id,
        "amount": amount,
        "reason": reason,
        "description": description
    }
    try:
        supabase.table("credits").insert(data).execute()
    except Exception as e:
        print(f"Error adding transaction: {e}")

# Keep class for backward compatibility if needed, but wrapper around global client
class SupabaseManager:
    def __init__(self):
        self.client = supabase

supabase_manager = SupabaseManager()
