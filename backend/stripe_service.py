
import os
import stripe
from fastapi import Request, HTTPException

class StripeService:
    """
    Handles Stripe payments, webhooks, and checkout sessions.
    """
    def __init__(self):
        self.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        if self.api_key:
            stripe.api_key = self.api_key

    def create_checkout_session(self, user_id: str, plan_type: str, price_id: str, success_url: str, cancel_url: str):
        """
        Creates a Stripe Checkout Session for a subscription.
        """
        if not self.api_key:
            raise Exception("Stripe API Key not configured")

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price': price_id,
                        'quantity': 1,
                    },
                ],
                mode='subscription',
                success_url=success_url,
                cancel_url=cancel_url,
                client_reference_id=user_id,
                metadata={
                    "plan_type": plan_type,
                    "user_id": user_id
                }
            )
            return checkout_session.url
        except Exception as e:
            print(f"Stripe Session Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    async def handle_webhook(self, request: Request):
        """
        Verifies and processes Stripe Webhooks.
        """
        payload = await request.body()
        sig_header = request.headers.get('stripe-signature')

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, self.webhook_secret
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")

        return event
