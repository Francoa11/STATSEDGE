from decimal import Decimal
from typing import Optional, Dict

class BettingValueEngine:
    """
    Core logic for calculating Edge, Kelly Criterion, and processing bet results including insurance.
    """

    @staticmethod
    def calculate_implied_probability(decimal_odds: float) -> float:
        """
        Calculates implied probability from decimal odds.
        Formula: 1 / odds
        """
        if decimal_odds <= 1.0:
            raise ValueError("Odds must be greater than 1.0")
        return 1 / decimal_odds

    @staticmethod
    def calculate_edge(p_model: float, p_implied: float) -> float:
        """
        Calculates the edge (advantage) over the bookmaker.
        Formula: P_model - P_implied
        Returns percentage as a float (e.g., 0.15 for 15%).
        """
        return p_model - p_implied

    @staticmethod
    def calculate_ev(p_model: float, decimal_odds: float) -> float:
        """
        Calculates Expected Value (EV).
        Formula: (P_model * (odds - 1)) - ((1 - P_model) * 1)
        """
        profit_on_win = decimal_odds - 1
        return (p_model * profit_on_win) - (1 - p_model)

    @staticmethod
    def calculate_kelly_stake(
        bankroll: float,
        p_model: float,
        decimal_odds: float,
        fraction: float = 0.25
    ) -> float:
        """
        Calculates the stake using the Fractional Kelly Criterion.
        Formula: K% = (bps * p - q) / bps
        where:
          bps = decimal_odds - 1 (net odds)
          p = p_model (probability of winning)
          q = 1 - p (probability of losing)
          
        Returns the monetary amount to bet based on bankroll.
        """
        if decimal_odds <= 1:
            return 0.0
            
        b = decimal_odds - 1
        q = 1 - p_model
        
        kelly_percentage = (b * p_model - q) / b
        
        # If Kelly is negative (negative EV), don't bet
        if kelly_percentage <= 0:
            return 0.0
            
        # Apply fraction (e.g., Quarter Kelly)
        adjusted_percentage = kelly_percentage * fraction
        
        return bankroll * adjusted_percentage

    def evaluate_opportunity(self, p_model: float, p_implied: float) -> Dict:
        """
        Evaluates a betting opportunity to determine if it meets Elite plan criteria within the core logic.
        Rule: If Edge > 10%, trigger Alert.
        """
        edge = self.calculate_edge(p_model, p_implied)
        is_elite_alert = edge > 0.10  # 10%
        
        return {
            "edge": edge,
            "is_elite_alert": is_elite_alert,
            "recommendation": "BET" if edge > 0 else "PASS"
        }

class InsuranceLogic:
    """
    Handles automatic refunds and insurance policies.
    """
    
    INSURANCE_CAP = 15.00  # $15 Insurance
    
    @staticmethod
    def process_bet_result(
        bet_amount: Decimal, 
        status: str, 
        is_daily_gold_pick: bool
    ) -> Optional[Decimal]:
        """
        Determines if a credit refund is due.
        Rule: If 'Daily Gold Pick' is LOST, refund up to $15.
        
        Args:
            bet_amount: The amount wagered.
            status: 'won' or 'lost'.
            is_daily_gold_pick: Boolean flag for the specific promo.
            
        Returns:
            Decimal amount to refund as credit, or None if no refund.
        """
        if status.lower() == 'lost' and is_daily_gold_pick:
            refund_amount = min(bet_amount, Decimal(InsuranceLogic.INSURANCE_CAP))
            return refund_amount
            
        return None
