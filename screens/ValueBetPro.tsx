import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../types';
import { supabase } from '../services/supabaseClient';
import { getQuickTickerUpdate, generateDeepAnalysis } from '../services/geminiService';
import { PaymentModal } from '../components/PaymentModal';
import { SuccessModal } from '../components/SuccessModal';
import PickCard from '../components/PickCard';
import AnalysisModal from '../components/AnalysisModal';

// Types matching Supabase Schema
interface UserProfile {
    user_id: string;
    subscription_status: 'free' | 'pro';
    purchased_picks: string[];
}

interface Pick {
    id: string;
    league_name: string;
    market_type: string;
    match: string; // "Home vs Away"
    odds: number;
    edge_percentage: number;
    ai_analysis: string; // JSON string or text
    event_date: string;
    confidence?: 'LOW' | 'MEDIUM' | 'HIGH';
    created_at?: string;
    // Computed/Optional for UI
    home?: string;
    away?: string;
    model_prob?: number;
    implied_prob?: number;
}

export const ValueBetPro: React.FC = () => {
    const navigate = useNavigate();

    // Real Data State
    const [picks, setPicks] = useState<Pick[]>([]);
    const [tickerItems, setTickerItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Derived Filters State
    const [availableLeagues, setAvailableLeagues] = useState<string[]>([]);
    const [availableMarkets, setAvailableMarkets] = useState<string[]>([]);

    // Filter Selection State
    const [selectedLeague, setSelectedLeague] = useState('All Leagues');
    const [selectedMarket, setSelectedMarket] = useState('All Markets');
    const [selectedDate, setSelectedDate] = useState('Todas las Fechas');

    // Filter Sheet UI State
    const [activeFilter, setActiveFilter] = useState<'league' | 'market' | 'date' | null>(null);

    // Filter Options Lists
    const dateOptions = ["Todas las Fechas", "Hoy", "Mañana", "Próximos 7 días"];
    const [leagueOptions, setLeagueOptions] = useState<string[]>(["All Leagues"]);
    const [marketOptions, setMarketOptions] = useState<string[]>(["All Markets"]);

    // Modals State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [analysisModal, setAnalysisModal] = useState<{ isOpen: boolean, pick: Pick | null }>({
        isOpen: false, pick: null
    });

    // Auth State
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Dates Helper
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

    // Market Icons Map
    const marketIcons: Record<string, string> = {
        'shots_on_target': '⚽',
        'cards': '🟨',
        'corners': '🚩',
        'goals': '🥅',
        'player_tackles': 'tg',
        'player_passes': 'p',
        '1X2': '🏆',
        'Over/Under Goals': '⚽',
        'Both Teams To Score': '🥅',
        'Corners': '🚩',
        'Cards': '🟨',
        'Shots on Target': '🎯'
    };

    // 🚀 FETCH DATA FROM SUPABASE
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            // 1. Get User/Profile
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
                if (data) setProfile(data as UserProfile);
            }

            // 2. Get Picks
            console.log("Fetching picks from Supabase...");
            const { data: picksData, error } = await supabase
                .from('daily_picks')
                .select('*')
                .eq('is_gold', false) // Exclude Gold Pick from main feed
                .order('edge_percentage', { ascending: false });

            if (error) {
                console.error('Error fetching picks:', error);
            } else if (picksData) {
                // Enrich picks with parsed fields if needed
                const processedPicks = picksData.map((p: any) => {
                    const [home, away] = p.match.split(' vs ');
                    const implied = 100 / p.odds;
                    const model = implied + p.edge_percentage; // Reverse eng model prob

                    return {
                        ...p,
                        home: home || "Home Team",
                        away: away || "Away Team",
                        model_prob: parseFloat(model.toFixed(1)),
                        implied_prob: parseFloat(implied.toFixed(1)),
                        confidence: p.edge_percentage > 8 ? 'HIGH' : p.edge_percentage > 4 ? 'MEDIUM' : 'LOW'
                    };
                });

                setPicks(processedPicks);

                // 3. Dynamic Filters Extraction
                const leagues = Array.from(new Set(processedPicks.map((p: Pick) => p.league_name))).sort() as string[];
                const markets = Array.from(new Set(processedPicks.map((p: Pick) => p.market_type))).sort() as string[];

                setLeagueOptions(["All Leagues", ...leagues]);
                setMarketOptions(["All Markets", ...markets]);

                // 4. Populate Ticker with Real Matches
                const newTickerItems = processedPicks.map((p: Pick) => {
                    let time = "";
                    try {
                        const parsed = JSON.parse(p.ai_analysis);
                        if (parsed.match_time) time = `[${parsed.match_time}]`;
                    } catch (e) { }
                    return `${p.match.toUpperCase()}  •  ${p.league_name.toUpperCase()}  ${time}`;
                });
                setTickerItems(newTickerItems);
            }

            setLoading(false);
        };

        fetchData();


    }, []);

    // Filtering Logic
    const filteredPicks = picks.filter(p => {
        const leagueMatch = selectedLeague === 'All Leagues' || p.league_name === selectedLeague;
        const marketMatch = selectedMarket === 'All Markets' || p.market_type === selectedMarket;

        let dateMatch = true;
        if (selectedDate === 'Hoy') dateMatch = p.event_date === today;
        if (selectedDate === 'Mañana') dateMatch = p.event_date === tomorrow;
        if (selectedDate === 'Próximos 7 días') dateMatch = p.event_date >= today; // Show all future

        return leagueMatch && marketMatch && dateMatch;
    });

    // Auth & Profile Loader
    useEffect(() => {
        const loadUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).single();
                if (data) setProfile(data as UserProfile);
            }
        };
        loadUser();

        loadUser();
    }, []);

    // Handlers
    const isUnlocked = (matchId: string, index: number) => {
        if (index < 2) return true; // First 2 free
        if (profile?.subscription_status === 'pro') return true;
        if (profile?.purchased_picks?.includes(matchId)) return true;
        return false;
    };

    const handleCardClick = (pick: Pick, index: number) => {
        if (!user) { navigate(Screen.Auth); return; }
        if (isUnlocked(pick.id, index)) {
            setAnalysisModal({ isOpen: true, pick });
        } else {
            setShowPaymentModal(true);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-bg text-text font-display overflow-hidden">

            {/* 1️⃣ Ticker - Compact Mobile */}
            <div className="h-6 bg-black border-b border-[#1E293B] flex items-center overflow-hidden whitespace-nowrap shrink-0 z-30">
                <div className="animate-marquee flex items-center gap-6 md:gap-12 px-2 text-[9px] md:text-[10px] font-mono tracking-widest text-muted">
                    <span className="text-edge font-bold">SYSTEM ACTIVE</span>
                    <span>MARKET SCAN: 12,402</span>
                    {tickerItems.map((item, i) => <span key={i} className="text-white">{item}</span>)}
                </div>
            </div>

            {/* 2️⃣ Mobile-First Header (Exact Match) */}
            <header className="h-16 border-b border-[#1E293B] bg-bg flex items-center justify-between px-4 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-edge rounded-sm flex items-center justify-center shadow-[0_0_12px_rgba(34,227,138,0.4)]">
                        <span className="material-symbols-outlined text-black font-bold text-xl">query_stats</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="text-sm font-black tracking-tighter text-white leading-none">STATSEDGE</h1>
                        <span className="text-[9px] font-mono text-gray-400 tracking-widest uppercase mt-0.5">MOBILE TERM V4.2</span>
                    </div>
                </div>

                <div className="flex items-center">
                    <button
                        onClick={() => setShowPaymentModal(true)}
                        className="bg-edge hover:bg-white text-black font-black text-[10px] px-4 py-2 rounded-sm uppercase tracking-wider shadow-glow-sm transition-all"
                    >
                        UPGRADE
                    </button>
                    {!user && (
                        <button onClick={() => navigate(Screen.Auth)} className="hidden text-[10px] font-bold text-muted border border-[#1E293B] px-2 py-1.5 rounded-sm ml-2">LOGIN</button>
                    )}
                </div>
            </header>

            {/* 3️⃣ Dashboard Content - Exact Colors Match */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 relative w-full bg-bg">
                <div className="max-w-xl mx-auto space-y-3">

                    {/* Title */}
                    <div className="flex justify-between items-end">
                        <h2 className="text-xl font-bold text-text tracking-tight uppercase font-mono">Today's Edge Scan</h2>
                    </div>

                    {/* Filters Row */}
                    {/* Filters Row - Updated for Leagues, Markets, Dates */}
                    {/* Filters Row - Mobile Pill System */}
                    <div className="flex flex-col gap-3 px-1">
                        <div className="grid grid-cols-3 gap-2">
                            {/* League Pill */}
                            <button
                                onClick={() => setActiveFilter('league')}
                                className="h-11 w-full rounded-lg bg-[#0B1220] border border-[#1F2A44] text-sm text-gray-200 flex items-center justify-between px-3 hover:bg-[#111827] transition-colors"
                            >
                                <span className="truncate flex-1 text-left font-medium text-[13px]">{selectedLeague === 'All Leagues' ? 'Ligas' : selectedLeague}</span>
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
                            </button>

                            {/* Market Pill */}
                            <button
                                onClick={() => setActiveFilter('market')}
                                className="h-11 w-full rounded-lg bg-[#0B1220] border border-[#1F2A44] text-sm text-gray-200 flex items-center justify-between px-3 hover:bg-[#111827] transition-colors"
                            >
                                <span className="truncate flex-1 text-left font-medium text-[13px]">{selectedMarket === 'All Markets' ? 'Mercados' : selectedMarket}</span>
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
                            </button>

                            {/* Date Pill */}
                            <button
                                onClick={() => setActiveFilter('date')}
                                className="h-11 w-full rounded-lg bg-[#0B1220] border border-[#1F2A44] text-sm text-gray-200 flex items-center justify-between px-3 hover:bg-[#111827] transition-colors"
                            >
                                <span className="truncate flex-1 text-left font-medium text-[13px]">{selectedDate === 'Todas las Fechas' ? 'Fecha' : selectedDate}</span>
                                <span className="material-symbols-outlined text-gray-400 text-[18px]">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between text-xs px-1">
                        <div className="text-muted font-medium">
                            Escaneados: <span className="text-text font-bold font-mono">142 Partidos</span>
                        </div>
                        <div className="text-muted font-medium">
                            Valor Detectado: <span className="text-edge font-bold font-mono">30 edges</span>
                        </div>
                    </div>

                    {/* Section Header */}
                    <div className="pt-2">
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-edge mb-3">TODAY'S EDGE SCAN</h3>

                        <div className="grid grid-cols-1 gap-3">
                            {loading ? (
                                <div className="text-center py-10 text-edge/50 animate-pulse text-xs font-mono">
                                    INITIALIZING QUANT TERMINAL...
                                </div>
                            ) : filteredPicks.length === 0 ? (
                                <div className="text-center py-10 text-muted text-xs">
                                    No hay oportunidades para los filtros seleccionados.
                                    <br />Intenta con "Todas las Fechas".
                                </div>
                            ) : <>
                                {!user && (
                                    <div
                                        onClick={() => navigate(Screen.Auth)}
                                        className="hidden md:flex flex-col items-center justify-center py-24 bg-[#0B1220]/50 border border-[#1F2A44] rounded-xl text-center hover:bg-[#0B1220] transition-all cursor-pointer group"
                                    >
                                        <div className="w-16 h-16 bg-[#0F1523] rounded-full flex items-center justify-center mb-6 shadow-lg border border-[#1E293B] group-hover:border-edge/50 group-hover:shadow-[0_0_20px_rgba(34,227,138,0.15)] transition-all">
                                            <span className="material-symbols-outlined text-gray-500 group-hover:text-edge text-3xl transition-colors">lock</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Desktop Access Locked</h3>
                                        <p className="text-xs font-mono text-gray-400 mb-8 max-w-sm leading-relaxed">
                                            The professional terminal view is reserved for registered members.<br />
                                            <span className="text-edge/80">Please log in to analyze edges.</span>
                                        </p>
                                        <button className="bg-edge text-black font-black text-[11px] px-8 py-3 rounded-sm uppercase tracking-wider hover:bg-white shadow-glow-sm transition-all transform group-hover:translate-y-[-2px]">
                                            Login to Terminal
                                        </button>
                                    </div>
                                )}
                                <div className={`grid grid-cols-1 gap-3 ${!user ? 'md:hidden' : ''}`}>
                                    {filteredPicks.map((pick, i) => {
                                        const unlocked = isUnlocked(pick.id, i);
                                        const mockOdds = pick.odds.toFixed(2);
                                        const edgeVal = pick.edge_percentage;
                                        let edgeColor = "text-[#8BA698]"; // Low: Sage Green/Gray
                                        let edgeGlow = "";

                                        if (edgeVal >= 8) {
                                            edgeColor = "text-edge";
                                            edgeGlow = "text-glow-edge";
                                        } else if (edgeVal >= 4) {
                                            edgeColor = "text-edgeSoft";
                                        }

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => handleCardClick(pick, i)}
                                                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${!unlocked ? 'opacity-80' : ''}`}
                                            >
                                                <div className="relative">
                                                    {/* Locked Overlay managed by parent if needed */}
                                                    {!unlocked && (
                                                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0F1523]/90 backdrop-blur-md rounded-lg border border-[#1E293B]">
                                                            <div className="p-3 bg-black/40 rounded-full mb-2 border border-[#4ADE80]/30 shadow-[0_0_15px_rgba(74,222,128,0.15)] animate-pulse">
                                                                <span className="material-symbols-outlined text-[#4ADE80] text-2xl">lock</span>
                                                            </div>
                                                            <span className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ACCESS ONLY</span>
                                                            <span className="text-[9px] font-mono text-gray-400">TAP TO REVEAL EDGE</span>
                                                        </div>
                                                    )}
                                                    <PickCard pick={pick} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>}
                        </div>
                    </div>
                </div>
            </main >

            {/* 4️⃣ Analysis Room Modal - Professional War Room */}
            {
                analysisModal.isOpen && analysisModal.pick && (
                    <AnalysisModal
                        pick={analysisModal.pick}
                        onClose={() => setAnalysisModal({ isOpen: false, pick: null })}
                    />
                )
            }

            {/* 5️⃣ Mobile Filter Bottom Sheet */}
            {
                activeFilter && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveFilter(null)}></div>

                        {/* Sheet Content */}
                        <div className="relative w-full max-w-md bg-[#0F1216] border-t sm:border border-[#1E293B] rounded-t-xl sm:rounded-xl p-4 shadow-xl animate-in slide-in-from-bottom duration-200">
                            <div className="flex justify-between items-center mb-4 pl-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                    {activeFilter === 'league' ? 'Filtrar por Liga' : activeFilter === 'market' ? 'Filtrar por Mercado' : 'Filtrar por Fecha'}
                                </h3>
                                <button onClick={() => setActiveFilter(null)} className="p-1 hover:bg-white/10 rounded-full">
                                    <span className="material-symbols-outlined text-muted">close</span>
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                                {(activeFilter === 'league' ? leagueOptions : activeFilter === 'market' ? marketOptions : dateOptions).map((opt) => {
                                    const isSelected =
                                        activeFilter === 'league' ? selectedLeague === opt :
                                            activeFilter === 'market' ? selectedMarket === opt :
                                                selectedDate === opt;

                                    return (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                if (activeFilter === 'league') setSelectedLeague(opt);
                                                if (activeFilter === 'market') setSelectedMarket(opt);
                                                if (activeFilter === 'date') setSelectedDate(opt);
                                                setActiveFilter(null);
                                            }}
                                            className={`w-full h-12 mb-2 rounded-lg px-4 flex items-center justify-between text-sm font-medium transition-all ${isSelected
                                                ? 'bg-green-900/40 border border-green-500 text-white'
                                                : 'bg-[#111827] text-gray-300 border border-transparent hover:bg-[#1F2937]'
                                                }`}
                                        >
                                            <span>{opt === "All Leagues" ? "Todas las Ligas" : opt === "All Markets" ? "Todos Mercados" : opt}</span>
                                            {isSelected && <span className="material-symbols-outlined text-green-400 text-lg">check</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )
            }

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={() => {
                    setShowSuccess(true);
                    // "Cualquiera... al pagar... tienen el acceso total" -> Grant PRO for demo satisfaction
                    setProfile(prev => prev ? { ...prev, subscription_status: 'pro' } : { user_id: 'demo', subscription_status: 'pro', purchased_picks: [] });
                }}
            />
            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
        </div >
    );
};
