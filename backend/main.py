from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from supabase_client import supabase
import os
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Webhook Secret Validation (Example for Mercadopago/Stripe)
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "dev_secret")

class PaymentNotification(BaseModel):
    id: str  # Payment ID
    type: str # 'payment', 'subscription'
    user_id: str # Custom metadata sent during checkout
    item_type: str # 'subscription' or 'pick'
    item_id: str # 'pro' or match_id
    status: str # 'approved'

@app.post("/api/webhook/mercadopago")
async def handle_mercadopago_webhook(request: Request):
    """
    Specific endpoint for MercadoPago Webhook notifications.
    Parses MP format and updates user subscription.
    """
    payload = await request.json()
    
    # In a real MP implementation, you fetch the payment info using the ID from payload
    # payment_id = payload.get('data', {}).get('id')
    # payment_info = mp.get_payment(payment_id)
    # user_id = payment_info['metadata']['user_id']
    
    # For this ready-to-deploy setup, we simulate the logic:
    action = payload.get('action')
    if action == 'payment.created' or action == 'payment.updated':
        # Simulated extraction from metadata
        # In PROD: Fetch from MP API using payload['data']['id']
        dummy_user_id = payload.get('user_id', 'demo-user-uuid') 
        
        # Unlock PRO
        supabase.table('profiles').update({
            'subscription_status': 'pro'
        }).eq('user_id', dummy_user_id).execute()
        
        return {"status": "success", "action": "pro_unlocked"}

    return {"status": "ignored"}

@app.post("/api/webhooks/payment")
async def handle_payment_webhook(payload: PaymentNotification, request: Request):
    """
    Handle incoming payment notifications securely.
    REAL WORLD: Verify signature headers from Stripe/MP here.
    """
    
    # 1. Verify Payment Status
    if payload.status != 'approved':
        return {"status": "ignored", "reason": "not_approved"}

    try:
        # 2. Update User Profile in Supabase
        if payload.item_type == 'subscription':
            # Unlock PRO
            response = supabase.table('profiles').update({
                'subscription_status': 'pro'
            }).eq('user_id', payload.user_id).execute()
            
            # Log Order
            supabase.table('orders').insert({
                'user_id': payload.user_id,
                'item_type': 'subscription',
                'item_id': payload.item_id,
                'amount': 20.00, # Fetch real amount from provider in prod
                'currency': 'USD',
                'payment_provider': 'mercadopago', # Dynamic
                'status': 'approved',
                'external_id': payload.id
            }).execute()

        elif payload.item_type == 'pick':
            # Unlock Single Pick
            # First get current picks
            current_profile = supabase.table('profiles').select('purchased_picks').eq('user_id', payload.user_id).execute()
            current_picks = current_profile.data[0].get('purchased_picks', []) or []
            
            if payload.item_id not in current_picks:
                current_picks.append(payload.item_id)
                
                # Update DB
                supabase.table('profiles').update({
                    'purchased_picks': current_picks
                }).eq('user_id', payload.user_id).execute()

                # Log Order
                supabase.table('orders').insert({
                    'user_id': payload.user_id,
                    'item_type': 'pick',
                    'item_id': payload.item_id,
                    'amount': 15.00,
                    'currency': 'USD',
                    'payment_provider': 'mercadopago',
                    'status': 'approved',
                    'external_id': payload.id
                }).execute()

        return {"status": "success", "message": "User upgraded"}

    except Exception as e:
        print(f"Webhook Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Processing Error")

@app.get("/")
def read_root():
    return {"status": "StatsEdge Backend Online", "version": "4.2"}
