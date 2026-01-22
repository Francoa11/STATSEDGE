import os
import requests
from typing import Dict, Any, List

class GeminiAgentService:
    """
    Service to interact with Google Gemini API for Search, Vision, and Text analysis.
    """
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    def search_injury_news(self, player_name: str, team_name: str) -> Dict[str, Any]:
        """
        Uses Gemini Search (or Grounding) to scan for real-time injury news.
        Simulates scanning verified sources: Olé, Marca, BBC Sport, Globo Esporte.
        """
        query = f"latest injury status {player_name} {team_name} verified"
        
        # MOCK LOGIC for Demo Purposes (Since we don't have a live Search Tool connected yet)
        # In production, this would use google-generativeai with tools='google_search_retrieval'
        
        import random
        # 30% chance of finding breaking news
        found_news = random.random() < 0.3
        
        if found_news:
             return {
                "query": query,
                "status": "breaking_news",
                "news_snippet": f"ÚLTIMA HORA: {player_name} se perdió la última sesión de entrenamiento. Duda para el próximo partido por fatiga muscular. Fuente: Periodista Local.",
                "impact_score": 0.85,
                "sources": ["Twitter @TeamUpdates", "Olé Argentina"]
            }
        
        return {
            "query": query,
            "status": "clear",
            "news_snippet": f"No se encontraron reportes de lesiones recientes para {player_name} en las últimas 24h. Se espera que sea titular.",
            "impact_score": 0.0,
            "sources": ["BBC Sport", "Sitio Oficial Club"]
        }

    def generate_insight_narrative(self, match: str, odds: float, model_probability: float, market_probability: float, stats: dict = None) -> str:
        """
        Generates a narrative following the V1.0 'Probabilidad Lógica' structure.
        """
        if stats is None: stats = {}
        
        # 1. ACTUAL PROMPT (Gemini)
        prompt = f"""
        Act as 'Stats Edge Quant Engine'.
        Goal: Explain the value of this bet using the 'Probabilidad Lógica' framework.
        
        IMPORTANT: Only analyze the specific match provided below. Do not invent/hallucinate teams or matches.
        
        Match: {match}
        Selection Odds: {odds}
        
        Using the input stats, act as a professional analyst and generate these 4 specific sections (Keep it brief, professional, no hype):
        
        1. 💎 JERARQUÍA Y FORMA: Recent form, xG trends, or team ranking.
        2. ⚔️ CONTEXTO DEL RIVAL: Opponent weaknesses or leaks.
        3. 🚨 DATO DE SEGURIDAD: Safety factor (home advantage, key player back, etc).
        4. 🧠 ESCENARIO TÁCTICO: Expected game flow (dominance vs counter).
        
        Language: Spanish (Professional/Technical).
        """

        # 2. SIMULATED RESONSE (Mock for Demo)
        import json
        
        h_xg = stats.get('home_xg_last_5', '1.8')
        a_xg = stats.get('away_xg_last_5', '1.1')
        poss = stats.get('possession_avg', '55')
        
        # We construct a formatted text for the UI
        narrative = (
            f"💎 JERARQUÍA Y FORMA\n"
            f"El equipo local promedia {h_xg} xG en sus últimas 5 presentaciones, mostrando una eficiencia superior a la media de la liga.\n\n"
            
            f"⚔️ CONTEXTO DEL RIVAL\n"
            f"El visitante concede {a_xg} xG por partido y ha mostrado fragilidad defensiva en transiciones rápidas.\n\n"
            
            f"🚨 DATO DE SEGURIDAD\n"
            f"La cuota {odds} cubre la varianza implícita, y el retorno de piezas clave en el mediocampo refuerza la estabilidad.\n\n"
            
            f"🧠 ESCENARIO TÁCTICO\n"
            f"Se proyecta un partido de dominio posicional ({poss}% est.) donde la presión alta forzará errores en salida."
        )
        
        return json.dumps({
            "analysis_text": narrative,
            "structured": {
                "hierarchy": f"Local promedia {h_xg} xG (últimos 5).",
                "rival": f"Visitante concede {a_xg} xG/partido.",
                "safety": "Retorno de titulares en mediocampo.",
                "tactical": f"Dominio posicional estimado del {poss}%."
            }
        }, ensure_ascii=False)

    def analyze_bet_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Uses Gemini Vision to parse a betting slip image.
        Extracts: User, Market, Selection, Stake, Odds.
        """
        # Placeholder for Vision API call
        # response = model.generate_content([prompt, image])
        
        return {
            "bookmaker": "Detected Bookie",
            "selections": [
                {"market": "Over 2.5 Goals", "odds": 1.95, "confidence": 0.98}
            ],
            "stake": 100.00
        }

class GeoSpatialAgent:
    """
    Service for geographic analysis (Altitude, Travel Distance).
    """
    
    def analyze_travel_impact(self, home_loc: str, away_loc: str) -> Dict[str, Any]:
        distance_km = 3200 # Mock distance
        altitude_diff = 2400 # Mock La Paz
        
        return {
            "distance_km": distance_km,
            "altitude_diff_meters": altitude_diff,
            "alerts": ["EXTREME_ALT", "LONG_TRAVEL"]
        }
