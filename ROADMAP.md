# Roadmap de Lanzamiento "QuantBet Turbo" 🚀

Estrategia para facturar en 15 días llevando el MVP a Producción.

## Fase A: Datos Reales (Día 1-2)
- **Integración Sportmonks API**: 
  - Conectar el backend Python a la API de fútbol profesional.
  - Reemplazar el `calculate_edge` simulado con probabilidades reales basadas en Poisson Distribution sobre datos históricos reales.
  - *Meta*: Que el "Arsenal vs Liverpool" del código sea el partido real del domingo.

## Fase B: Infraestructura "Live" (Día 3-5)
- **Despliegue Full-Stack**:
  - **Backend**: Render.com (Dockerizado).
  - **Database**: Supabase Pro (para backups reales).
  - **Frontend**: Vercel.com (con dominio propio `.pro` o `.ai`).
- **Autenticación**:
  - Activar Google OAuth en Supabase.
  - Reemplazar el usuario `demo-user-uuid` por `supabase.auth.user().id`.

## Fase C: Marketing & Transparencia (Día 6-10)
- **Dashboard de Transparencia (CLV)**:
  - Implementar la tabla pública que compare `Entry Odds` vs `Closing Price`.
  - Demostrar matemáticamente el "Edge" generado por la IA.
- **Telegram Bot Integration**:
  - Crear un bot `@QuantBetAlertsBot`.
  - Enviar notificaciones PUSH automáticas: "🚨 ELITE ALERT: Edge detectado +12.5%".

## Fase D: Monetización Activa (Día 11-15)
- **Stripe Connect**:
  - Reemplazar el "Mock Mode" del `PaymentModal` con Stripe Checkout real.
  - Configurar webhooks para aprovisionamiento automático de suscripciones.
