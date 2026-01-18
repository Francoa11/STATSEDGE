const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface BetAnalysisRequest {
    user_id: string; // UUID from Supabase Auth
    match_id: string;
    market: string;
    selection: string;
    odds: number;
    p_model: number;
    stake: number;
}

export interface BetAnalysisResponse {
    edge_percent: number;
    kelly_stake: number;
    recommendation: string;
    is_elite_alert: boolean;
}

export interface InjuryCheckRequest {
    player_name: string;
    team_name: string;
}

export const BetService = {
    /**
     * Analyzes a potential bet to calculate Edge and Kelly Stake.
     */
    analyzeBet: async (data: BetAnalysisRequest): Promise<BetAnalysisResponse> => {
        try {
            const response = await fetch(`${API_URL}/analyze-bet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error analyzing bet: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("BetService Error:", error);
            throw error;
        }
    },

    /**
     * Checks for player injuries using Gemini Search Agent
     */
    checkInjury: async (data: InjuryCheckRequest): Promise<any> => {
        try {
            const response = await fetch(`${API_URL}/check-injury`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Injury check failed");
            return await response.json();
        } catch (error) {
            console.error("Injury Check Error:", error);
            throw error;
        }
    }
};
