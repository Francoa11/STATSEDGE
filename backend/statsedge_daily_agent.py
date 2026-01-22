import time
import requests
import json
import os
from datetime import datetime
from supabase import create_client, Client
from google import genai
from google.genai import types
from dotenv import load_dotenv

# --- CARGAR VARIABLES DE ENTORNO ---
load_dotenv()
ODDS_API_KEY = os.getenv("ODDS_API_KEY", "128133df6f81ea2caf0164b8db49c112")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# CLIENTES
if not GEMINI_API_KEY or not SUPABASE_URL:
    print("❌ ERROR: Faltan claves en .env")
    
try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error cliente: {e}")

def fetch_real_matches():
    print("--- 1. CONECTANDO CON THE ODDS API (DATOS REALES - SIN FILTROS) ---")
    leagues = [
        "soccer_uefa_champs_league", 
        "soccer_argentina_primera_division",
        "soccer_brazil_campeonato",
        "soccer_mexico_ligamx",
        "soccer_spain_la_liga",
        "soccer_england_league1"
    ]
    
    all_matches = []
    
    for league in leagues:
        # CAMBIO CLAVE: Quitamos "&bookmakers=1xbet" para que traiga CUALQUIERA disponible
        # Usamos regions=eu,us (Europa y USA tienen la mayoría de datos)
        url = f"https://api.the-odds-api.com/v4/sports/{league}/odds/?apiKey={ODDS_API_KEY}&regions=eu,us&markets=h2h"
        
        try:
            res = requests.get(url)
            if res.status_code == 200:
                data = res.json()
                # Filtramos partidos futuros
                future_matches = [m for m in data if m['commence_time'] > datetime.utcnow().isoformat()]
                
                # VERIFICACIÓN DE DEBUG
                count_with_odds = sum(1 for m in future_matches if m.get('bookmakers'))
                print(f"✅ {league}: {len(future_matches)} partidos. ({count_with_odds} con cuotas listas).")
                
                all_matches.extend(future_matches)
            else:
                print(f"❌ Error API ({league}): {res.status_code}")
        except Exception as e:
            print(f"Error de conexión en {league}: {e}")
            
    return all_matches

def analyze_and_upload(matches):
    print("--- 2. ANALIZANDO CON GEMINI 2.0 (MODO BATCH / LOTES) ---")
    
    if not matches:
        return

    # 1. Filtrar partidos válidos (que tengan cuotas)
    valid_matches = []
    for m in matches:
        if m.get('bookmakers') and m['bookmakers'][0]['markets']:
            valid_matches.append(m)
            
    print(f"📊 Partidos válidos para análisis: {len(valid_matches)}")
    
    # Procesamos en lotes de 5 para no saturar (Max 30 partidos total)
    valid_matches = valid_matches[:30]
    BATCH_SIZE = 5
    
    for i in range(0, len(valid_matches), BATCH_SIZE):
        batch = valid_matches[i : i + BATCH_SIZE]
        print(f"\n📦 Procesando Lote {i//BATCH_SIZE + 1} ({len(batch)} partidos)...")
        
        # Construir Prompt Unificado
        matches_text = ""
        for idx, m in enumerate(batch):
            teams = f"{m['home_team']} vs {m['away_team']}"
            league = m['sport_title']
            # Safe access to odds
            try:
                odds_data = m['bookmakers'][0]['markets'][0]['outcomes']
                matches_text += f"\nPARTIDO #{idx+1}:\nEvento: {teams}\nLiga: {league}\nCuotas: {json.dumps(odds_data)}\n"
            except:
                continue

        prompt = f"""
        Actúa como Analista Quant Senior. Analiza este GRUPO de partidos REALES.
        
        {matches_text}
        
        INSTRUCCIONES:
        Para CADA partido listado arriba, genera un análisis de valor (Edge).
        
        Debes devolver un ARRAY JSON exacto con un objeto por cada partido:
        [
            {{
                "match_index": 1,  <-- IMPORTANTE: El número de partido del input (1, 2, 3...)
                "match": "Home vs Away",
                "league_name": "Nombre Liga",
                "market_type": "1X2" o "Over/Under",
                "selection": "Tu predicción",
                "odds": 1.95,
                "edge_percentage": 8.5,
                "confidence_score": 4, 
                "variance_label": "High Value" o "Medium Risk",
                "category": "todays_edge",
                "ai_analysis": "Análisis en 1 frase técnica",
                "bet_description": "Tesis ultracorta",
                "is_gold": false
            }},
            ...
        ]
        
        Responde ÚNICAMENTE con el JSON ARRAY.
        """

        try:
            response = client.models.generate_content(
                model="gemini-2.0-flash-exp", 
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            
            picks_list = json.loads(response.text)
            
            # Procesar y guardar cada pick del lote
            for pick in picks_list:
                try:
                    # Recuperar datos originales (Fecha!) usando el índice
                    p_idx = int(pick.get("match_index", 0)) - 1
                    if 0 <= p_idx < len(batch):
                        original = batch[p_idx]
                        pick['match_date'] = original['commence_time']
                        # Asegurar nombres correctos
                        pick['match'] = f"{original['home_team']} vs {original['away_team']}"
                        pick['league_name'] = original['sport_title']
                    
                    # UI Compatibility: ai_analysis to JSON string
                    ai_an = pick.get("ai_analysis")
                    if isinstance(ai_an, str):
                        pick["ai_analysis"] = json.dumps({"analysis_text": ai_an})
                    elif isinstance(ai_an, dict):
                        pick["ai_analysis"] = json.dumps(ai_an)
                        
                    # Limpiar campo auxiliar
                    if "match_index" in pick: del pick["match_index"]
                    
                    supabase.table("daily_picks").insert(pick).execute()
                    print(f"   ✅ Guardado: {pick.get('selection')} ({pick.get('match')})")
                    
                except Exception as save_err:
                    print(f"   ❌ Error guardando pick: {save_err}")

            # Pausa breve entre lotes (menos estricta que partida a partida)
            print("⏳ Esperando 5s antes del siguiente lote...")
            time.sleep(5)
            
        except Exception as e:
            print(f"❌ Error en el Lote: {e}")
            time.sleep(5)

# --- EJECUCIÓN ---
if __name__ == "__main__":
    print("🚀 INICIANDO STATSEDGE AGENT (TIER: PRO)...")
    real_data = fetch_real_matches()
    analyze_and_upload(real_data)
    print("🏁 FEED ACTUALIZADO CON ÉXITO.")
