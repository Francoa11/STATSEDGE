
// Real Odds Service ready for Production API Keys
const ODDS_API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const ODDS_BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export interface OddsMarket {
    key: string;
    title: string;
    last_update: string;
    markets: any[];
}

export const fetchMarketOdds = async (sportKey: string = 'soccer_epl', region: string = 'eu'): Promise<{ bookmakers: OddsMarket[] }> => {
    // If no key, fall back to mock data
    if (!ODDS_API_KEY || ODDS_API_KEY.includes('YOUR_')) {
        console.warn("Using Mock Odds (No API Key found)");
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            bookmakers: [
                { key: 'pinnacle', title: 'Pinnacle', last_update: new Date().toISOString(), markets: [{ key: 'h2h', outcomes: [{ name: 'Home', price: 1.95 }, { name: 'Away', price: 3.80 }, { name: 'Draw', price: 3.40 }] }] },
                { key: 'bet365', title: 'Bet365', last_update: new Date().toISOString(), markets: [{ key: 'h2h', outcomes: [{ name: 'Home', price: 1.91 }, { name: 'Away', price: 4.00 }, { name: 'Draw', price: 3.50 }] }] }
            ]
        };
    }

    try {
        const response = await fetch(`${ODDS_BASE_URL}/${sportKey}/odds/?apiKey=${ODDS_API_KEY}&regions=${region}&markets=h2h`);
        if (!response.ok) throw new Error('Odds API Error');
        const data = await response.json();
        // The Odds API returns an array of matches, we normally filter by ID here. 
        // For this function we assume it returns the list and we'd find the match.
        // Returning structure similar to our mock for compatibility.
        return { bookmakers: data[0]?.bookmakers || [] };
    } catch (e) {
        console.error("Odds Fetch Failed", e);
        return { bookmakers: [] };
    }
};

export const calculateEdge = (probability: number, odds: number) => {
    // Probability is 0-1 (e.g., 0.55 for 55%)
    // Odds are Decimal (e.g., 2.00)

    // Fair Odds = 1 / Probability
    // Edge = (Probability * Odds) - 1
    // Example: 55% win * 2.00 odds = 1.10 - 1 = 0.10 (10% Edge)

    const decimalEdge = (probability * odds) - 1;
    return (decimalEdge * 100).toFixed(1);
};
