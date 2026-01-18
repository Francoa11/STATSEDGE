# Guía de Despliegue - Soccer Estadística Avanzada

Sigue estos pasos para llevar tu aplicación a producción ("Live").

## 1. Base de Datos (Supabase)

1. Ve a [Supabase.com](https://supabase.com) y crea un "New Project".
2. Una vez creado, ve a **Settings > Database** y copia tus credenciales.
3. Ve al **SQL Editor** en el dashboard de Supabase.
4. Abre el archivo `backend/database_schema.sql` de tu proyecto local, copia todo el contenido y pégalo en el editor de Supabase. Dale a "Run".
   - Esto creará las tablas `bets`, `users`, `wallets`, etc.
5. Ve a **Project Settings > API** y copia:
   - `Project URL`
   - `anon` public key
   - `service_role` secret (¡Mantenlo seguro! Es para el backend).

## 2. Backend (Render / Railway)

Recomendamos **Render** por su simplicidad gratuita/barata para Python.

1. Sube tu carpeta `backend` a un repositorio de GitHub (o todo el proyecto).
2. Crea una cuenta en [Render.com](https://render.com).
3. Selecciona "New + > Web Service".
4. Conecta tu repositorio.
5. Usa la siguiente configuración:
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. En la sección **Environment Variables**, añade:
   - `SUPABASE_URL`: (Tu URL de Supabase)
   - `SUPABASE_SERVICE_KEY`: (Tu Service Role Key de Supabase)
   - `GEMINI_API_KEY`: (Tu API Key de Google AI)
7. Dale a "Deploy". Cuando termine, te dará una URL (ej: `https://mi-api.onrender.com`).

## 3. Frontend (Vercel)

1. Ve a [Vercel.com](https://vercel.com) y loguéate con GitHub.
2. Importa tu repositorio.
3. En "Build & Output Settings", Vercel suele detectar Vite automáticamente (`npm run build`).
4. En **Environment Variables**, añade:
   - `VITE_SUPABASE_URL`: (Tu URL de Supabase)
   - `VITE_SUPABASE_ANON_KEY`: (Tu Anon Key de Supabase)
   - `VITE_API_URL`: (La URL que te dio Render en el paso anterior, sin la barra final)
5. Dale a "Deploy".

¡Tu aplicación estará viva en internet! 🚀
