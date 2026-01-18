import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../types';
import { supabase } from '../services/supabaseClient';
import { getQuickTickerUpdate, fetchLiveMatches, generateDeepAnalysis } from '../services/geminiService';
import { PaymentModal } from '../components/PaymentModal';
import { SuccessModal } from '../components/SuccessModal';

interface UserProfile {
    user_id: string;
    email: string;
    subscription_status: 'free' | 'pro';
    purchased_picks: string[];
}

export const ValueBetPro: React.FC = () => {
    const navigate = useNavigate();
    const [tickerItems, setTickerItems] = useState<string[]>([]);

    // UI State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [reasoningModal, setReasoningModal] = useState<{ isOpen: boolean, content: string | null, title: string }>({
        isOpen: false, content: null, title: ''
    });
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Auth & Profile State
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);

    const [expandedAnalysis, setExpandedAnalysis] = useState<number | null>(null);

    const [matches, setMatches] = useState<any[]>([
        {
            id: 'm1', time: '19:45', league: 'EPL', home: 'Arsenal', away: 'Brighton', xG: '2.1 - 0.8', edge: '+4.5%',
            ai_analysis: {
                market: "La cuota de Arsenal (1.85) subestima su xG reciente en casa (2.3/partido).",
                factors: "• Brighton permite 1.5 xGA de visitante.\n• Arsenal recupera a Odegaard.",
                verdict: "Stake Recomendado: 1.5u a Arsenal -0.75 AH."
            }
        },
        {
            id: 'm2', time: '20:00', league: 'LL', home: 'Real Madrid', away: 'Getafe', xG: '3.0 - 0.2', edge: '+8.1%',
            ai_analysis: {
                market: "Línea de gol en 2.5 es incorrecta. Modelo proyecta 3.2 goles.",
                factors: "• Getafe con defensa alternativa.\n• Vinicius Jr. en racha.",
                verdict: "Stake Recomendado: 2u a Real Madrid Over 2.5 Team Goals."
            }
        },
        { id: 'm3', time: '20:30', league: 'SERIE A', home: 'Juventus', away: 'Torino', xG: '1.5 - 0.5', edge: '+5.2%' },
        { id: 'm4', time: '21:00', league: 'LIGUE 1', home: 'PSG', away: 'Marseille', xG: '2.8 - 1.1', edge: '+6.7%' },
        { id: 'm5', time: '21:15', league: 'NBA', home: 'Lakers', away: 'Warriors', xG: '112 - 108', edge: '+3.4%' },
        { id: 'm6', time: '22:00', league: 'MLB', home: 'Yankees', away: 'Red Sox', xG: '4.5 - 3.2', edge: '+2.1%' },
    ]);

    // Fetch User & Profile
    useEffect(() => {
        const loadUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                // Initial Load
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (data) setProfile(data as UserProfile);

                // Realtime Listener for Instant Unlock
                const channel = supabase
                    .channel('profile-updates')
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'profiles',
                            filter: `user_id=eq.${session.user.id}`
                        },
                        (payload) => {
                            console.log('Profile updated!', payload);
                            const newProfile = payload.new as UserProfile;
                            setProfile(newProfile);

                            // Trigger Success UI if status changed to Pro
                            if (newProfile.subscription_status === 'pro') {
                                setShowPaymentModal(false);
                                setShowSuccess(true);
                            }
                            // Trigger if Pick added
                            if (newProfile.purchased_picks?.length > (profile?.purchased_picks?.length || 0)) {
                                setShowPaymentModal(false);
                                setShowSuccess(true);
                            }
                        }
                    )
                    .subscribe();

                return () => { supabase.removeChannel(channel); };
            }
        };
        loadUser();
    }, []);

    const handleLockedClick = (matchId?: string) => {
        // If guest, go to login. If logged in but locked, go to payment.
        if (!user) {
            navigate(Screen.Auth);
        } else {
            setShowPaymentModal(true);
        }
    };

    const handleAnalysisClick = async (match: any, index: number) => {
        // Double check lock status dynamically
        const isPro = profile?.subscription_status === 'pro';
        const isPurchased = profile?.purchased_picks?.includes(match.id);
        const isFreeTeaser = index < 2;

        const unlocked = isPro || isPurchased || isFreeTeaser;

        if (!unlocked) {
            handleLockedClick(match.id);
            return;
        }

        setIsAnalyzing(true);
        // Set title but reset content
        setReasoningModal({ isOpen: true, content: null, title: `${match.home} vs ${match.away}` });

        try {
            const rawAnalysis = await generateDeepAnalysis(`${match.home} vs ${match.away}`);
            // Parse JSON response
            let analysisData;
            try {
                analysisData = JSON.parse(rawAnalysis);
            } catch (e) {
                // Fallback if AI returns plain text
                analysisData = { market: "Análisis General", factors: rawAnalysis, verdict: "Verificar manualmente." };
            }

            // We need to update the STATE to show this content. 
            // Currently, ValueBetPro displays `match.ai_analysis`. 
            // We should ideally update the `match` object OR use the modal state to display this specific analysis.
            // For now, let's show it in the modal content block we have.
            // But wait, the modal currently just dumps string content. Let's format it.

            const formattedContent = `${analysisData.market}\n\n${analysisData.factors}\n\n${analysisData.verdict}`;

            setReasoningModal(prev => ({ ...prev, content: formattedContent }));

            // OPTIONAL: Update the match object in place so the expandable panel also has it?
            // This is complex as `matches` is state. Let's just stick to the modal for "Deep Reasoning".

        } catch (error) {
            setReasoningModal(prev => ({ ...prev, content: "Analysis failed. Please try again." }));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleEdgeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!user) {
            navigate(Screen.Auth);
        }
    };

    useEffect(() => {
        getQuickTickerUpdate().then(items => {
            if (Array.isArray(items)) setTickerItems(items);
        }).catch(console.error);
    }, []);

    return (
        <div className="flex h-full w-full bg-background-dark text-white overflow-hidden font-display">
            {/* Sidebar (Visual only for Guest - Desktop only) */}
            <aside className="hidden md:flex flex-col w-64 border-r border-surface-border bg-[#0F1216] h-full flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold tracking-tight text-white">STATS<span className="text-primary">EDGE</span></h1>
                    {user ? (
                        <div className="mt-2 flex flex-col gap-1">
                            <span className="text-[10px] text-text-muted uppercase">Terminal Activa</span>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-xs font-bold text-white">Plan: {profile?.subscription_status === 'pro' ? 'PRO' : 'Free'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 text-xs text-primary border border-primary/30 bg-primary/10 px-2 py-1 rounded inline-block">MODO INVITADO</div>
                    )}
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative overflow-hidden">
                {/* Header - PropCash Style */}
                <header className="h-14 border-b border-surface-border flex items-center justify-between px-4 bg-[#0F172A] shrink-0 z-20 sticky top-0">
                    <div className="flex items-center gap-3">
                        {/* Logo */}
                        <div className="flex items-center gap-1.5 md:gap-2">
                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-black text-sm">equalizer</span>
                            </div>
                            <h1 className="text-sm font-black tracking-tighter text-white hidden md:block">STATS<span className="text-primary">EDGE</span></h1>
                        </div>

                        {/* Sport Selector */}
                        <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/5 ml-2">
                            <button className="px-3 py-1 rounded-md bg-white/10 text-white text-[10px] font-bold shadow-sm">Fútbol</button>
                            <button className="px-3 py-1 rounded-md text-text-muted hover:text-white text-[10px] font-bold transition-colors">NBA</button>
                            <button className="px-3 py-1 rounded-md text-text-muted hover:text-white text-[10px] font-bold transition-colors">Tenis</button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!user && (
                            <button
                                onClick={() => navigate(Screen.Auth)}
                                className="hidden md:flex items-center h-8 px-4 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                Login
                            </button>
                        )}
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="flex items-center gap-1.5 h-8 px-3 bg-primary hover:bg-primary-dim text-black text-xs font-bold rounded transition-colors shadow-glow whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-[16px]">verified</span>
                            <span>Upgrade</span>
                        </button>
                    </div>
                </header>

                {/* Ticker */}
                <div className="h-8 border-b border-surface-border bg-[#0d120c] flex items-center overflow-hidden whitespace-nowrap shrink-0">
                    <div className="animate-marquee flex items-center gap-8 px-4 text-xs font-mono">
                        <span className="text-primary font-bold">LIVE FEED:</span>
                        <span className="text-text-muted">MARKET EFFICIENT (NO BET) @ FRA vs GER</span>
                        {tickerItems.length > 0 ? tickerItems.map((item, i) => (
                            <span key={i} className="text-gray-400">{item}</span>
                        )) : <span className="text-gray-500">Scanning global markets...</span>}
                        <span className="text-text-muted">MARKET EFFICIENT (NO BET) @ BRA vs ARG</span>
                    </div>
                </div>

                {/* Content - Mobile First Optimized */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 w-full max-w-[100vw]">
                    <div className="max-w-5xl mx-auto flex flex-col gap-4 md:gap-8">

                        {/* Value Prop Banner - Desktop Only */}
                        <div className="hidden md:flex relative overflow-hidden rounded-xl bg-gradient-to-r from-surface-dark to-[#0F172A] border border-surface-border p-8 flex-col md:flex-row items-center justify-between gap-6 group">
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3fff14_1px,transparent_1px)] [background-size:24px_24px]"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Detecta valor real, no intuición.</h2>
                                <p className="text-text-muted max-w-lg leading-relaxed">
                                    La mayoría pierde por apostar a resultados. Los profesionales apuestan a <span className="text-primary font-bold">Desajuste de Precios</span>.
                                    Nuestros algoritmos procesan 10k+ puntos de datos para encontrar la ventaja.
                                </p>
                            </div>
                            <div className="relative z-10 flex flex-col items-end">
                                <div className="text-3xl font-mono font-bold text-white">3,492</div>
                                <div className="text-xs text-text-muted uppercase tracking-widest">Oportunidades Escaneadas Hoy</div>
                            </div>
                        </div>

                        {/* Mobile Stats Compact Line */}
                        <div className="md:hidden flex items-center justify-between px-2 py-2 bg-surface-dark/50 border border-white/5 rounded-lg mb-2">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">radar</span>
                                <span className="text-xs font-bold text-white">3,492 Oportunidades</span>
                            </div>
                            <span className="text-[10px] text-text-muted uppercase tracking-wider">Escaneo Completado</span>
                        </div>

                        {/* Matches List - PropCash Style Rows */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between px-2 mb-2">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    Jugadas de Alta Convicción
                                </h3>
                                <span className="text-xs text-text-muted">Scanner Activo</span>
                            </div>

                            {matches.map((match, i) => {
                                // Paywall Logic
                                const isPro = profile?.subscription_status === 'pro';
                                const isPurchased = profile?.purchased_picks?.includes(match.id);
                                const isTeaser = i < 2; // Keep first 2 free

                                const isUnlocked = isPro || isPurchased || isTeaser;
                                const isLocked = !isUnlocked;

                                const isAnalysisOpen = expandedAnalysis === i;
                                const edgeValue = parseFloat(match.edge);
                                const isHighEdge = edgeValue > 5.0;

                                return (
                                    <div key={i} className="flex flex-col w-full">
                                        <div
                                            onClick={() => isLocked ? handleLockedClick(match.id) : setExpandedAnalysis(isAnalysisOpen ? null : i)}
                                            className={`relative bg-surface-dark border ${isLocked ? 'border-surface-border/50 cursor-pointer' : `border-surface-border ${isAnalysisOpen ? 'border-primary' : 'hover:border-primary/50'}`} rounded-lg flex items-center justify-between p-2 md:p-3 gap-2 md:gap-4 transition-all group overflow-hidden cursor-pointer w-full min-h-[60px]`}
                                        >
                                            {/* Locked Shield Overlay (Subtle) */}
                                            {isLocked && (
                                                <div className="absolute inset-0 z-10 bg-black/10 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="material-symbols-outlined text-primary drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">lock</span>
                                                </div>
                                            )}

                                            {/* 1. Time & League (Mini Column) */}
                                            <div className="flex flex-col items-center justify-center w-[45px] md:w-[60px] shrink-0 border-r border-white/5 pr-2">
                                                <span className="text-[10px] md:text-xs font-mono text-white font-bold">{match.time}</span>
                                                <span className="text-[8px] md:text-[9px] text-text-muted uppercase mt-0.5">{match.league}</span>
                                            </div>

                                            {/* 2. Event (Teams) - Expanded */}
                                            <div className="flex-1 flex flex-col justify-center min-w-0">
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <span className="font-bold text-white text-xs md:text-sm truncate">{match.home}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 truncate mt-0.5">
                                                    <span className="font-bold text-white text-xs md:text-sm truncate">{match.away}</span>
                                                </div>
                                            </div>

                                            {/* 3. Data Density Columns (xG, Prob, Edge) */}
                                            <div className="flex items-center gap-1 md:gap-4 shrink-0">
                                                {/* xG */}
                                                <div className="hidden md:flex flex-col items-end">
                                                    <span className="text-[9px] text-text-muted uppercase">xG Proj</span>
                                                    <span className={`text-xs font-mono text-white ${isLocked ? 'blur-sm select-none' : ''}`}>
                                                        {match.xG.split(' - ')[0]}<span className="text-text-muted mx-0.5">-</span>{match.xG.split(' - ')[1]}
                                                    </span>
                                                </div>

                                                {/* AI Probability */}
                                                <div className="flex flex-col items-center w-[50px] md:w-[60px]">
                                                    <span className="text-[8px] md:text-[9px] text-text-muted uppercase mb-0.5">Win%</span>
                                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 w-[65%]"></div>
                                                    </div>
                                                    <span className="text-[9px] font-mono text-blue-400 mt-0.5">65%</span>
                                                </div>

                                                {/* The EDGE (Semaforo) */}
                                                <div
                                                    onClick={handleEdgeClick}
                                                    className={`flex flex-col items-center justify-center w-[55px] md:w-[70px] h-[40px] rounded-lg ${isHighEdge ? 'bg-primary/20 border border-primary/50' : 'bg-yellow-500/20 border border-yellow-500/50'
                                                        }`}
                                                >
                                                    <span className="text-[8px] text-text-muted uppercase font-bold">EDGE</span>
                                                    <span className={`text-xs md:text-sm font-black tracking-tight ${isHighEdge ? 'text-primary' : 'text-yellow-500'
                                                        }`}>
                                                        {match.edge}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 4. Action (Chevron) */}
                                            <div className="w-6 flex justify-center shrink-0">
                                                <span className={`material-symbols-outlined text-text-muted ${isAnalysisOpen ? 'rotate-90 text-primary' : ''} transition-transform`}>
                                                    chevron_right
                                                </span>
                                            </div>
                                        </div>

                                        {/* AI Analysis Panel */}
                                        {
                                            isAnalysisOpen && (
                                                <div className="bg-[#0B1015] border border-primary/20 rounded-lg p-4 ml-4 md:ml-10 animate-in slide-in-from-top-2 relative overflow-hidden mt-2">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <span className="material-symbols-outlined text-primary text-lg animate-pulse">smart_toy</span>
                                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Informe de Inteligencia StatsEdge</h4>
                                                        <span className="bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded ml-auto font-mono">MODELO V.4.2</span>
                                                    </div>

                                                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 relative`}>
                                                        {/* Block 1 */}
                                                        <div>
                                                            <h5 className="text-[10px] text-text-muted uppercase font-bold mb-1">Estado del Mercado</h5>
                                                            <p className="text-xs text-gray-300 leading-relaxed">
                                                                {match.ai_analysis?.market || "Analizando liquidez y movimientos de línea..."}
                                                            </p>
                                                        </div>
                                                        {/* Block 2 */}
                                                        <div className="border-l border-white/5 pl-4 md:border-l-0 md:pl-0">
                                                            <h5 className="text-[10px] text-text-muted uppercase font-bold mb-1">Factores de Ventaja</h5>
                                                            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                                                                {match.ai_analysis?.factors || "Escaneando noticias y alineaciones..."}
                                                            </p>
                                                        </div>
                                                        {/* Block 3 */}
                                                        <div className="bg-white/5 rounded p-3 border border-white/5">
                                                            <h5 className="text-[10px] text-primary uppercase font-bold mb-1">Veredicto StatsEdge</h5>
                                                            <p className="text-xs text-white font-bold leading-relaxed">
                                                                {match.ai_analysis?.verdict || "Calculando Stake Óptimo..."}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* This should technically not be reached if locked due to logic above, but good fallback or for specific 'Partial' locks in future */}
                                                </div>
                                            )
                                        }
                                    </div>
                                )
                            })}
                        </div>

                        <div className="text-center py-6">
                            <p className="text-xs text-text-muted">
                                "El mercado es eficiente el 90% del tiempo. Nosotros encontramos el 10%."
                                <br />
                                <span className="opacity-50">Datos con 15 min de retraso para usuarios Invitados.</span>
                            </p>
                        </div>
                    </div>
                </div>

                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    onSuccess={() => {
                        // Refresh profile after purchase success (simulated)
                        setProfile(prev => prev ? ({ ...prev, subscription_status: 'pro' }) : null);
                        // Show visual success
                        setShowSuccess(true);
                    }}
                />

                <SuccessModal
                    isOpen={showSuccess}
                    onClose={() => setShowSuccess(false)}
                />

                {/* Deep Reasoning Modal */}
                {
                    reasoningModal.isOpen && (
                        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setReasoningModal({ ...reasoningModal, isOpen: false })}>
                            <div className="bg-surface-dark border border-primary/50 rounded-xl max-w-2xl w-full p-8 shadow-[0_0_50px_rgba(63,255,20,0.2)] relative" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => setReasoningModal({ ...reasoningModal, isOpen: false })}
                                    className="absolute top-4 right-4 text-text-muted hover:text-white"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>

                                <div className="flex items-center gap-3 mb-6">
                                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">psychology</span>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Razonamiento Profundo Gemini™</h2>
                                        <p className="text-sm text-text-muted">Objetivo: {reasoningModal.title}</p>
                                    </div>
                                </div>

                                <div className="bg-[#0F172A] rounded p-6 mb-6 border-l-4 border-primary min-h-[120px]">
                                    {isAnalyzing ? (
                                        <div className="flex items-center gap-3 text-text-muted">
                                            <span className="material-symbols-outlined animate-spin">sync</span>
                                            <span>Pensando... procesando 10k puntos de datos...</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {reasoningModal.content?.split('\n\n').map((block, i) => (
                                                <div key={i} className={`p-4 rounded-lg border ${i === 2 ? 'bg-primary/10 border-primary/30' : 'bg-surface-dark border-white/5'}`}>
                                                    <p className={`text-sm leading-relaxed ${i === 2 ? 'font-bold text-white' : 'text-gray-300'}`}>
                                                        {block}
                                                    </p>
                                                </div>
                                            ))}
                                            {/* L10 Chart Placeholder */}
                                            <div className="pt-4 border-t border-white/10">
                                                <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Rendimiento Reciente (L10)</h4>
                                                <div className="flex gap-1 h-8">
                                                    {[1, 1, 0, 1, 1, 1, 0, 1, 0, 1].map((r, idx) => (
                                                        <div key={idx} className={`flex-1 rounded-sm ${r ? 'bg-green-500' : 'bg-red-500'} opacity-80`}></div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                                                    <span>Hace 10 partidos</span>
                                                    <span>Último</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setReasoningModal({ ...reasoningModal, isOpen: false })}
                                    className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-primary-dim"
                                >
                                    Cerrar Inteligencia
                                </button>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    );
};
