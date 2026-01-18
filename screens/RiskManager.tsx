import React, { useState, useEffect } from 'react';
import { getStadiumInfo } from '../services/geminiService';
import { GroundingChunk } from '../types';
import { supabase } from '../services/supabaseClient';
import { PaymentModal } from '../components/PaymentModal';
import { PerformanceHistory } from '../components/PerformanceHistory';

export const RiskManager: React.FC = () => {
    const [bankroll, setBankroll] = useState(5000);
    const [kellyFraction, setKellyFraction] = useState(0.25);
    const [mapsChunks, setMapsChunks] = useState<GroundingChunk[]>([]);

    // Payment UI State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [userTier, setUserTier] = useState('free'); // Would come from Auth Context

    // Dynamic Risk Signals State
    const [riskSignals, setRiskSignals] = useState({
        extremeAltitude: false,
        longTravel: false,
        refereeRisk: true
    });

    // Toast State
    const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' | 'error' } | null>(null);
    const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Supabase Realtime Listener
    useEffect(() => {
        // Subscribe to wallet changes
        const walletSubscription = supabase
            .channel('realtime:wallets')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'wallets'
                // In production, add filter: `user_id=eq.${currentUserId}`
            }, (payload) => {
                const newBalance = payload.new.balance;
                if (newBalance) {
                    // Update state to reflect automated refund or deposit
                    setBankroll(Number(newBalance));
                    console.log("Realtime Wallet Update:", newBalance);

                    // Visual feedback (optional toast could go here)
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(walletSubscription);
        };
    }, []);

    // Derived values
    const edge = 0.125; // 12.5% (Simulated ELITE EDGE)
    const odds = 2.45;
    const fullKelly = (((edge * odds) - (1 - edge)) / odds) * 10;
    const suggestedStake = (bankroll * (fullKelly / 100)) * kellyFraction;

    // Daily Exposure Simulation
    const dailyExposurePercent = 4.2;
    const exposureLimit = 5.0;

    const isEliteLocked = edge > 0.10 && userTier !== 'elite';

    // Deep Reasoning State
    const [isScanning, setIsScanning] = useState(false);
    const [reasoningResult, setReasoningResult] = useState<{ narrative: string, sources: string[] } | null>(null);

    const handleDeepScan = async () => {
        setIsScanning(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

            // 1. Scan for News
            const newsRes = await fetch(`${API_URL}/check-injury`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ player_name: "Bukayo Saka", team_name: "Arsenal" })
            });

            if (!newsRes.ok) throw new Error("Backend Unavailable");

            const newsData = await newsRes.json();

            // 2. Generate Insight
            const insightRes = await fetch(`${API_URL}/generate-insight`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    match_id: "ARS-LIV",
                    edge: edge,
                    news_context: newsData.news_snippet
                })
            });
            const insightData = await insightRes.json();

            setReasoningResult({
                narrative: insightData.narrative,
                sources: newsData.sources || ["QuantBet Internal DB"]
            });

        } catch (e) {
            console.error("Backend Error, using simulation fallback", e);
            // Fallback Simulation for Demo
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate work
            setReasoningResult({
                narrative: "Modelo detecta ineficiencia significativa en ARS-LIV. El escaneo de noticias simula 'Saka Titular', confirmando la ventaja del modelo ante la incertidumbre del mercado. (Modo Fallback)",
                sources: ["Simulación Fallback", "Base de Datos Interna"]
            });
            showToast("Backend no detectado. Usando modo simulación.", "info");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="bg-[#0F172A] text-slate-100 font-display overflow-hidden h-screen flex w-full">
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={(tier) => setUserTier(tier)}
            />

            {/* Deep Reasoning Overlay Modal */}
            {reasoningResult && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-surface-dark border border-primary/50 rounded-xl max-w-2xl w-full p-8 shadow-[0_0_50px_rgba(63,255,20,0.2)]">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-4xl text-primary animate-pulse">psychology</span>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Gemini Deep Reasoning™</h2>
                                <p className="text-sm text-text-muted">Analysis ID: #GEN-88392 • Model 1.5 Pro</p>
                            </div>
                        </div>

                        <div className="bg-[#0F172A] rounded p-6 mb-6 border-l-4 border-primary">
                            <p className="text-lg text-gray-200 leading-relaxed font-serif italic">
                                "{reasoningResult.narrative}"
                            </p>
                        </div>

                        <div className="flex gap-4 mb-8">
                            {reasoningResult.sources.map((src, i) => (
                                <span key={i} className="text-xs bg-surface-light px-2 py-1 rounded text-text-muted border border-surface-border">
                                    Fuente: {src}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={() => setReasoningResult(null)}
                            className="w-full py-3 bg-primary text-black font-bold rounded hover:bg-primary-dim"
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            <aside className="w-64 border-r border-border-dark bg-[#0F1216] hidden lg:flex flex-col flex-shrink-0 z-20">
                <div className="p-6">
                    <h1 className="text-white text-base font-bold tracking-tight">Gestor<span className="text-danger">Riesgo</span></h1>
                    <div className="mt-2 inline-flex items-center gap-2 px-2 py-1 rounded-full bg-surface-light border border-surface-border">
                        <span className={`w-2 h-2 rounded-full ${userTier === 'elite' ? 'bg-[#FFD700] shadow-[0_0_10px_#FFD700]' : 'bg-gray-400'}`}></span>
                        <span className={`text-[10px] uppercase font-bold ${userTier === 'elite' ? 'text-[#FFD700]' : 'text-text-muted'}`}>Plan {userTier}</span>
                    </div>
                </div>

                {userTier === 'free' && (
                    <div className="mx-4 mt-auto mb-6 p-4 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 text-center">
                        <p className="text-xs text-white mb-3">Mejora para desbloquear criterio Kelly completo.</p>
                        <button
                            onClick={() => setShowPaymentModal(true)}
                            className="w-full py-1.5 rounded bg-primary text-black text-xs font-bold hover:bg-primary-dim"
                        >
                            Mejorar Ahora
                        </button>
                    </div>
                )}
            </aside>
            <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-[#0F172A] overflow-y-auto pb-32">
                <div className="p-8 lg:p-12 max-w-6xl mx-auto w-full">
                    <div className="flex flex-col gap-2 mb-10">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Tamaño de Posición & Contexto</h2>
                        <p className="text-text-muted">Gestiona la varianza. Nunca apuestes más de lo que el modelo implica.</p>
                    </div>

                    {/* UX Intervention: Portfolio Exposure Monitor */}
                    <div className="mb-8 bg-surface-dark border border-border-dark rounded-lg p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Exposición Diaria Activa</h3>
                            <p className="text-xs text-text-muted">Total de banca en riesgo en todas las posiciones abiertas.</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className={`text-2xl font-mono font-bold ${dailyExposurePercent > exposureLimit ? 'text-danger' : 'text-white'}`}>
                                    {dailyExposurePercent}%
                                </span>
                                <span className="text-xs text-text-muted block">de Banca</span>
                            </div>
                            <div className="h-10 w-[1px] bg-border-dark"></div>
                            <div className="w-32">
                                <div className="flex justify-between text-[10px] text-text-muted mb-1">
                                    <span>Safe</span>
                                    <span>Limit ({exposureLimit}%)</span>
                                </div>
                                <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${dailyExposurePercent > exposureLimit ? 'bg-danger' : 'bg-primary'}`}
                                        style={{ width: `${(dailyExposurePercent / exposureLimit) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left: Calculator */}
                        <div className="bg-surface-dark border border-border-dark rounded-lg p-6 shadow-2xl relative overflow-hidden">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">calculate</span> Calculadora Criterio Kelly
                            </h3>

                            <div className={`space-y-8 transition-all duration-500 ${isEliteLocked ? 'blur-sm opacity-50' : ''}`}>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs text-text-muted uppercase">Banca Total</label>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-white">${bankroll.toLocaleString()}</span>
                                            <span className="text-[10px] text-primary bg-primary/10 px-1 rounded animate-pulse">EN VIVO</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range" min="1000" max="50000" step="100"
                                        value={bankroll} onChange={(e) => setBankroll(Number(e.target.value))}
                                        disabled={isEliteLocked}
                                        className="w-full h-2 bg-[#0F172A] rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs text-text-muted uppercase">Estrategia Fracción Kelly</label>
                                        <span className={`font-mono font-bold ${kellyFraction > 0.5 ? 'text-danger' : 'text-primary'}`}>{kellyFraction}x {kellyFraction > 0.5 ? '(Agresiva)' : '(Óptima)'}</span>
                                    </div>
                                    <input
                                        type="range" min="0.1" max="1" step="0.05"
                                        value={kellyFraction} onChange={(e) => setKellyFraction(Number(e.target.value))}
                                        disabled={isEliteLocked}
                                        className="w-full h-2 bg-[#0F172A] rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-[10px] text-text-muted mt-2">
                                        <span>0.1x (Conservadora)</span>
                                        <span>1.0x (Full Kelly / Arriesgada)</span>
                                    </div>
                                </div>

                                <div className="bg-[#0F172A] border border-border-dark rounded p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-xs text-text-muted uppercase mb-1">Stake Sugerido</div>
                                        <div className="text-2xl font-mono font-bold text-white">${suggestedStake.toFixed(2)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-text-muted uppercase mb-1">Impacto Cartera</div>
                                        <div className="text-xl font-mono font-bold text-primary">{((suggestedStake / bankroll) * 100).toFixed(2)}%</div>
                                    </div>
                                </div>
                            </div>

                            {/* LOCKED OVERLAY */}
                            {isEliteLocked && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] z-10">
                                    <span className="material-symbols-outlined text-4xl text-[#FFD700] mb-2">lock</span>
                                    <h3 className="text-xl font-bold text-[#FFD700] uppercase tracking-widest mb-1">Edge Elite Detectado</h3>
                                    <p className="text-sm text-gray-300 mb-6">Valor {'>'} 10% reservado para miembros Sindicato.</p>
                                    <button
                                        onClick={() => setShowPaymentModal(true)}
                                        className="px-6 py-2 bg-[#FFD700] text-black font-bold rounded hover:bg-[#FFC000] transition-transform transform hover:scale-105"
                                    >
                                        Desbloquear Posición
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Context Signals (Dynamic) */}
                        <div className="flex flex-col gap-6">
                            {/* News Intelligence Agent */}
                            <div className="bg-surface-dark border border-primary/30 rounded-lg p-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-6xl text-primary">news</span>
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">smart_toy</span> Agente Noticias Gemini
                                </h3>
                                <p className="text-xs text-text-muted mb-4 z-10 relative">
                                    Escanea 50+ fuentes verificadas para reportes de lesiones y alineaciones en tiempo real.
                                </p>
                                <button
                                    onClick={handleDeepScan}
                                    disabled={isScanning || isEliteLocked}
                                    className={`w-full py-2 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all
                                        ${isScanning ? 'bg-surface-light text-text-muted cursor-wait' : 'bg-primary text-black hover:bg-primary-dim'}
                                        ${isEliteLocked ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {isScanning ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-sm">sync</span> Escaneando...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-sm">search_check</span> Escanear Noticias
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="bg-surface-dark border border-border-dark rounded-lg p-6">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-warning">warning</span> Señales de Contexto de Riesgo
                                </h3>
                                <div className="space-y-3">
                                    {riskSignals.extremeAltitude ? (
                                        <div className="flex items-start gap-3 p-3 bg-[#0F172A] border border-danger/50 rounded">
                                            <span className="material-symbols-outlined text-danger mt-0.5">landscape</span>
                                            <div>
                                                <div className="text-sm font-bold text-white">Altitud Extrema (La Paz)</div>
                                                <p className="text-xs text-text-muted">Ventaja local amplificada al 15%. Niveles de oxígeno impactan resistencia visitante post-60min.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3 p-3 bg-[#0F172A] border border-border-dark rounded opacity-50">
                                            <span className="material-symbols-outlined text-text-muted mt-0.5">landscape</span>
                                            <div>
                                                <div className="text-sm font-bold text-text-muted">Altitud Normal</div>
                                            </div>
                                        </div>
                                    )}

                                    {riskSignals.longTravel ? (
                                        <div className="flex items-start gap-3 p-3 bg-[#0F172A] border border-warning/50 rounded">
                                            <span className="material-symbols-outlined text-warning mt-0.5">flight_takeoff</span>
                                            <div>
                                                <div className="text-sm font-bold text-white">Viaje Largo Recorrido</div>
                                                <p className="text-xs text-text-muted">Visitante viajó {'>'} 3.000km. Rendimiento histórico cae 8%.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-3 p-3 bg-[#0F172A] border border-border-dark rounded opacity-50">
                                            <span className="material-symbols-outlined text-text-muted mt-0.5">flight_takeoff</span>
                                            <div>
                                                <div className="text-sm font-bold text-text-muted">Distancia Viaje Corta</div>
                                            </div>
                                        </div>
                                    )}

                                    {riskSignals.refereeRisk && (
                                        <div className="flex items-start gap-3 p-3 bg-[#0F172A] border border-border-dark rounded">
                                            <span className="material-symbols-outlined text-text-muted mt-0.5">sports_soccer</span>
                                            <div>
                                                <div className="text-sm font-bold text-white">Árbitro: Mateu Lahoz</div>
                                                <p className="text-xs text-text-muted">Alta frecuencia tarjetas (5.4 prom). Riesgo varianza alto.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Transparency Log Component */}
                            <PerformanceHistory />
                        </div>
                    </div>
                </div>
            </main>
            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1a232e] border border-primary/30 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(63,255,20,0.2)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[100]">
                    <span className="material-symbols-outlined text-primary text-sm">{toast.type === 'success' ? 'check_circle' : 'info'}</span>
                    <span className="text-sm font-mono">{toast.message}</span>
                </div>
            )}
        </div>
    );
};
