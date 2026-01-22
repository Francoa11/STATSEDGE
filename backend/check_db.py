
import os
import sys
from dotenv import load_dotenv

# Ensure we can import from local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from supabase_client import supabase

def run_migration():
    print("Running migration to add columns...")
    
    # We can't run raw SQL easily via python client without RLS/extensions sometimes.
    # But we can try to "update" a row to check if cols exist, or just rely on user running SQL.
    # However, since I cannot run SQL directly, I will assume the User MUST run the SQL file.
    # But I will try one trick: access the table and see if it errors.
    
    try:
        # Just check connection
        res = supabase.table("daily_picks").select("id").limit(1).execute()
        print("Connection success. Please run 'backend/FINAL_SETUP.sql' in Supabase Dashboard SQL Editor manually to ensure columns exist.")
    except Exception as e:
        print(f"Error connecting: {e}")

if __name__ == "__main__":
    run_migration()
