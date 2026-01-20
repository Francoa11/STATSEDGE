import os
import sys
from dotenv import load_dotenv

# Ensure we can import from local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from supabase_client import supabase, get_user_profile
from ai_agents import GeminiAgentService
from betting_logic import BettingValueEngine

load_dotenv()

def run_daily_update():
    """
    Main entry point for the daily prediction agent.
    1. Fetches fixtures.
    2. Runs AI Analysis.
    3. Saves High-Value Bets to Supabase.
    """
    print("--- StatsEdge Daily Agent Started ---")
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("Warning: GEMINI_API_KEY not found in env.")

    # Initialize Agent
    agent = GeminiAgentService(api_key=gemini_key or "placeholder_key")

    # Mock fixture list for 'Daily Update' simulation
    # In production, this would call SportMonks API
    fixtures = [
        {"id": "f_101", "home": "Liverpool", "away": "Chelsea", "league": "Premier League"},
        {"id": "f_102", "home": "Real Madrid", "away": "Girona", "league": "La Liga"},
        {"id": "f_103", "home": "Inter", "away": "Juventus", "league": "Serie A"},
    ]

    print(f"Processing {len(fixtures)} fixtures...")

    for f in fixtures:
        match_title = f"{f['home']} vs {f['away']}"
        print(f"Analyzing: {match_title}...")
        
        # 1. Get AI Insight (News/Injuries)
        news_data = agent.search_injury_news(f['home'], f['home'])
        
        # 2. Calculate Edge (Mock Model)
        # Assume our proprietary model gives us a p_model
        p_model = 0.55 # 55% win probability
        implied_prob = 0.48 # Bookie odds ~2.08
        
        # 3. Generate Narrative
        edge = p_model - implied_prob
        narrative = agent.generate_insight_narrative(match_title, edge, news_data['news_snippet'])
        
        print(f"  > Edge: {edge*100:.1f}%")
        print(f"  > Insight: {narrative}")
        
        # 4. Save to Database (Mock)
        # supabase.table('predictions').insert({...})
    
    print("--- Daily Update Completed Successfully ---")

if __name__ == "__main__":
    run_daily_update()
