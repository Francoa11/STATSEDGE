import json
import os
from datetime import datetime
from supabase import create_client, Client
from dotenv import load_dotenv, find_dotenv

# Cargar variables de entorno buscando el archivo .env automáticamente
load_dotenv(find_dotenv()) 

# --- TUS CLAVES (Leídas del .env) ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") 

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Error: Faltan las claves en el archivo .env")
    exit()

# Conexión
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def cargar_rapido():
    print("🚀 Iniciando carga manual (AI Labeling)...")
    
    try:
        # Buscamos en la raiz
        file_path = 'picks_hoy.json'
            
        if not os.path.exists(file_path):
             print(f"❌ No encuentro el archivo {file_path}")
             return

        with open(file_path, 'r', encoding='utf-8') as f:
            datos_raw = json.load(f)
        
        if not datos_raw:
            print("⚠️ El archivo está vacío.")
            return

        print(f"📄 Leídos {len(datos_raw)} picks.")

        # --- TRANSFORMACIÓN DE DATOS ---
        datos_db = []
        fecha_hoy = datetime.now().strftime("%Y-%m-%d")
        
        for item in datos_raw:
            # --- MAPEO INTELIGENTE DE CLAVES (Soporta formato viejo y nuevo) ---
            match_val = item.get("match") or item.get("evento") or "Unknown Match"
            league_val = item.get("league_name") or item.get("liga") or "General"
            selection_val = item.get("selection") or item.get("prediccion") or "Selection"
            odds_val = float(item.get("odds") or item.get("cuota") or 1.0)
            
            # --- EDGE Y CONFIDENCE ---
            # Si vienen explícitos en el JSON (Nuevo formato)
            if "edge_percentage" in item:
                edge_val = float(item["edge_percentage"])
            else:
                # Derivar de texto (Viejo formato)
                edge_txt = str(item.get("edge", "MEDIA")).upper()
                if "GOLD" in edge_txt: edge_val = 12.5
                elif "ALTA" in edge_txt or "HIGH" in edge_txt: edge_val = 10.5
                elif "MEDIUM" in edge_txt: edge_val = 7.5
                else: edge_val = 4.0

            if "confidence_score" in item:
                conf_score = int(item["confidence_score"])
            else:
                # Derivar de edge
                conf_score = 5 if edge_val > 10 else 4 if edge_val > 7 else 3

            # --- CATEGORÍA ---
            is_gold_pick = item.get("is_gold") or item.get("es_gold") or False
            # Auto-detect gold from edge value if flag missing
            if edge_val > 11: is_gold_pick = True
            
            category_val = "gold" if is_gold_pick else "todays_edge"
            bet_desc = "AI Value Pick"

            # --- ANÁLISIS RICO ---
            # Buscamos el texto principal en 'ai_analysis' (nuevo) o 'analisis' (viejo)
            analysis_text = item.get("verdict") or item.get("ai_analysis") or item.get("analisis")
            if not analysis_text:
                analysis_text = f"Oportunidad detectada por Algoritmo en {selection_val}."
            
            key_stats = item.get("key_stats", {})
            key_insights = item.get("key_insights", [])

            rich_analysis_data = {
                "analysis_text": str(analysis_text),
                "key_stats": key_stats,
                "key_insights": key_insights,
                "risk_assessment": item.get("risk_assessment", {}),
                "match_time": item.get("match_time", "")
            }

            # 4. Construir objeto DB
            pick = {
                "match": match_val,
                "league_name": league_val,
                "selection": selection_val,
                "odds": odds_val,
                "edge_percentage": edge_val,
                "confidence_score": conf_score,
                "market_type": "Manual Pick", 
                "match_date": fecha_hoy,     
                "category": category_val,
                "ai_analysis": json.dumps(rich_analysis_data),
                "bet_description": bet_desc, 
                "is_gold": is_gold_pick
            }
            datos_db.append(pick)

        # Borrado AUTOMÁTICO para evitar bloqueo
        print("🧹 Borrando picks anteriores automáticamente...")
        try:
            supabase.table('daily_picks').delete().neq('match', 'impossible_placeholder').execute()
        except:
            pass
            try:
                supabase.table('daily_picks').delete().neq('match', 'impossible_placeholder').execute()
                print("🧹 Datos anteriores borrados.")
            except:
                pass 

        # Insertar
        data = supabase.table('daily_picks').insert(datos_db).execute()
        
        print(f"✅ ¡ÉXITO! Se han cargado {len(datos_db)} picks con etiquetas de IA.")
        
    except Exception as e:
        print(f"❌ Error durante la carga: {e}")

if __name__ == "__main__":
    cargar_rapido()
