import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Screen } from '../types';

export const AppNavigation: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 p-2 bg-[#121810] border border-surface-border rounded-lg shadow-2xl opacity-90 hover:opacity-100 transition-opacity">
            <span className="text-xs text-text-muted font-mono px-2">SWITCH TERMINAL:</span>
            <select 
                value={location.pathname} 
                onChange={(e) => navigate(e.target.value)}
                className="bg-surface-dark text-white text-xs font-mono border border-surface-border rounded p-1 focus:border-primary focus:ring-0"
            >
                <option value={Screen.ValueBetPro}>1. ValueBet Pro</option>
                <option value={Screen.ProAnalyst}>2. Pro Analyst</option>
                <option value={Screen.GoldPick}>3. Gold Pick</option>
                <option value={Screen.Syndicate}>4. Elite Syndicate</option>
                <option value={Screen.RiskManager}>5. Risk Manager</option>
            </select>
        </div>
    );
};
