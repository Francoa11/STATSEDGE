
# 🧪 Plan de Pruebas y Verificación (Agente Antigravity)

Este documento detalla los pasos para verificar la robustez, los cálculos matemáticos y los flujos de pago del sistema **QuantBet Pro**.

## 1. Verificación de Conversión y Pagos (Stripe)

### Objetivo:
Asegurar que el botón "Mejorar a Pro" inicie correctamente una sesión de Checkout y que, tras el pago, el usuario reciba el acceso.

### Pasos de Prueba:
1.  **Navegación:** Ir a `ValueBetPro` o `RiskManager` como usuario "Free".
2.  **Acción:** Hacer clic en "Mejorar a Pro" (Upgrade to Pro).
3.  **Resultado Esperado:** 
    - [ ] El modal `PaymentModal.tsx` se abre correctamente en Español.
    - [ ] Al seleccionar "Plan Analista ($20/mes)", se debe redirigir a `checkout.stripe.com` o a la URL simulada si no hay keys.
4.  **Confirmación de Pago (Webhook):**
    - Se debe simular un evento `checkout.session.completed` enviando un POST a `/webhook`.
    - **Resultado Backend:** Verificar en los logs que aparece `Payment successful for user... Unlocking pro...`.
    - **Resultado Frontend:** Refrescar y verificar que `isEliteLocked` ahora es `false` (simulado o real).

## 2. Validación Matemática (Calculadora Kelly)

### Objetivo:
Garantizar que no existan errores de cálculo que pongan en riesgo el bankroll del usuario.

### Matriz de Pruebas (Kelly Criterion):

| Bankroll ($) | Prob Modelo (P) | Cuota (O) | Kelly Completo (f*) | Fracción (0.25x) | Stake Esperado ($) | Estado |
|--------------|-----------------|-----------|---------------------|------------------|--------------------|--------|
| $1,000       | 0.55            | 2.00      | 10%                 | 2.5%             | $25.00             | ✅      |
| $5,000       | 0.60            | 1.80      | 10%                 | 2.5%             | $125.00            | ✅      |
| $2,000       | 0.40            | 2.40      | -2.8%               | 0%               | $0.00 (No Bet)     | ✅      |

### Pasos de Ejecución Automática:
Ejecutar el siguiente script de python para validar la lógica del backend (`betting_logic.py`):

```python
from betting_logic import BettingValueEngine

engine = BettingValueEngine()
stake = engine.calculate_kelly_stake(bankroll=1000, p_model=0.55, decimal_odds=2.00, fraction=0.25)
assert abs(stake - 25.0) < 0.1, f"Error en Kelly: {stake} != 25.0"
print("Prueba Kelly 1: APROBADA")
```

## 3. Persistencia Inmutable (Supabase)

### Objetivo:
Verificar que los resultados de partidos se guarden automáticamente para el registro histórico.

### Pasos:
1.  Activar el webhook simulado `/process-result` con payload `{ "status": "LOST", "is_daily_gold_pick": true }`.
2.  Verificar que se genera un registro en la tabla `credits` de Supabase (o log de mock).
3.  Confirmar que el saldo del usuario se actualiza (Reembolso de Seguro).

## 4. Auditoría de UX y Lints

### Estado Actual:
- **Responsive:** Se detectó desbordamiento leve en `ProAnalyst` en móviles pequeños. -> *Acción: Ajustar Tailwind classes.*
- **Lints:** Se corrigieron variables duplicadas en `EliteSyndicate.tsx`.
- **Traducción:** 100% Completa.

---
*Generado por Antigravity Agent - 2026-01-16*
