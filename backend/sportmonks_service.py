
import os
import requests
from typing import Dict, Any, Optional

class SportmonksService:
    """
    Service to interact with Sportmonks API for real-time football data.
    """
    def __init__(self):
        self.api_key = os.getenv("SPORTMONKS_API_KEY")
        self.base_url = "https://api.sportmonks.com/v3/football"

    def get_live_scores(self) -> Dict[str, Any]:
        """
        Fetches live scores for supported leagues.
        """
        if not self.api_key:
            return {"error": "API Key missing", "data": []}
            
        try:
            url = f"{self.base_url}/livescores?api_token={self.api_key}&include=participants,scores"
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            print(f"Sportmonks API Error: {e}")
            return {"error": str(e), "data": []}

    def get_fixture_odds(self, fixture_id: str) -> Dict[str, Any]:
        """
        Fetches odds for a specific fixture.
        """
        if not self.api_key:
            return {"error": "API Key missing", "data": []}

        try:
            url = f"{self.base_url}/odds/fixture/{fixture_id}?api_token={self.api_key}"
            response = requests.get(url)
            return response.json()
        except Exception as e:
            print(f"Sportmonks Odds Error: {e}")
            return {"error": str(e), "data": []}
