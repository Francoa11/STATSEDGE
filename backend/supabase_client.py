import os
from supabase import create_client, Client
from typing import Dict, Any

class SupabaseManager:
    """
    Manages connection to Supabase project.
    Handles Realtime broadcast triggers (if needed manually) and Database operations.
    """
    
    def __init__(self):
        self.url: str = os.getenv("SUPABASE_URL", "")
        self.key: str = os.getenv("SUPABASE_SERVICE_KEY", "") # Use Service Role Key for backend ops
        
        if not self.url or not self.key:
            print("Warning: SUPABASE_URL or SUPABASE_SERVICE_KEY not set.")
            self.client = None
        else:
            self.client: Client = create_client(self.url, self.key)

    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Fetch user profile from 'profiles' table."""
        if not self.client: return {}
        response = self.client.table("profiles").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data else {}

    def get_user_wallet(self, user_id: str) -> Dict[str, Any]:
        """Fetch user wallet to check balance."""
        if not self.client: return {}
        response = self.client.table("wallets").select("*").eq("user_id", user_id).execute()
        return response.data[0] if response.data else {}

    def update_wallet_balance(self, user_id: str, new_balance: float):
        """Updates the wallet balance. Realtime subscribers on frontend will be notified automatically via Postgres Changes."""
        if not self.client:
            print(f"[MOCK Supabase] Updating wallet for user {user_id} to ${new_balance}")
            return
        self.client.table("wallets").update({"balance": new_balance}).eq("user_id", user_id).execute()

    def add_credit_transaction(self, wallet_id: str, amount: float, reason: str, description: str):
        """Logs a transaction in 'credits' table."""
        if not self.client:
            print(f"[MOCK Supabase] Adding credit to wallet {wallet_id}: ${amount} ({reason}) - {description}")
            return
        data = {
            "wallet_id": wallet_id,
            "amount": amount,
            "reason": reason,
            "description": description
        }
        self.client.table("credits").insert(data).execute()

    def update_user_subscription(self, user_id: str, tier: str, price: float):
        """Updates or creates a subscription for the user."""
        if not self.client:
            print(f"[MOCK Supabase] Updating subscription for user {user_id} to {tier} (${price})")
            return
            
        # Check if subscription exists
        res = self.client.table("subscriptions").select("id").eq("user_id", user_id).execute()
        
        data = {
            "user_id": user_id,
            "tier": tier,
            "price": price,
            "is_active": True
        }
        
        if res.data:
            # Update existing
            self.client.table("subscriptions").update(data).eq("user_id", user_id).execute()
        else:
            # Insert new
            self.client.table("subscriptions").insert(data).execute()

    def get_user_subscription(self, user_id: str):
        """Gets current active subscription."""
        if not self.client:
            # Return Mock Data for testing
            return {"tier": "free", "is_active": True}
        
        res = self.client.table("subscriptions").select("*").eq("user_id", user_id).eq("is_active", True).execute()
        return res.data[0] if res.data else {"tier": "free"}

# Singleton instance
supabase_manager = SupabaseManager()
