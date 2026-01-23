import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { PaymentModal } from '../components/PaymentModal';
import { SuccessModal } from '../components/SuccessModal';

interface GoldPickData {
    match: string;
    bet_description: string;
    description?: string; // fallback
    odds: number;
    edge_percentage: number;
    ai_analysis: string;
    confidence?: string; // "HIGH"
    _model_prob?: number; // 0.884
    market_type?: string;
}

export const GoldPick: React.FC = () => {
    const [unlocked, setUnlocked] = useState(false);
    const [pick, setPick] = useState<GoldPickData | null>(null);
    const [loading, setLoading] = useState(true);
    const [thinking, setThinking] = useState(false);
    const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchGoldPick();
    }, []);

    const fetchGoldPick = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('daily_picks')
                .select('*')
                .eq('is_gold', true)
                .order('created_at', { ascending: false }) // Get latest if multiple (should be 1)
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') { // 116 is 'Row not found' which is fine
                console.error("Error fetching Gold Pick:", error);
            }

            if (data) {
                setPick(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'info' | 'success' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleUnlock = async () => {
        // Direct to payment flow
        setShowPaymentModal(true);
    };

    // Derived values
    const modelConf = pick?._model_prob ? (pick._model_prob * 100).toFixed(1) : "N/A";
    const riskVal = pick?._model_prob ? (100 - (pick._model_prob * 100)).toFixed(0) : "0";

    if (loading) return <div className="flex h-screen items-center justify-center bg-[#0F1216] text-white">Cargando Gold Pick...</div>;

    if (!pick) return (
        <div className="flex h-screen w-full bg-[#0F1216] text-white font-display items-center justify-center flex-col gap-4">
            <span className="material-symbols-outlined text-gray-600 text-6xl">sentiment_dissatisfied</span>
            <h2 className="text-2xl font-bold">No hay Gold Pick hoy</h2>
            <p className="text-text-muted">El modelo no encontró ninguna oportunidad con Edge &gt; 5% / Estabilidad suficiente.</p>
        </div>
    );

    return (
        <div className="flex h-screen w-full bg-[#0F1216] text-white font-display overflow-hidden">
            <aside className="w-64 hidden md:flex flex-col border-r border-border-dark bg-[#0F1216] flex-shrink-0 z-20">
                <div className="p-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-warning text-xl">emoji_events</span>
                    <span className="text-sm font-bold tracking-widest text-white uppercase">Gold<span className="text-warning">Pick</span></span>
                </div>
                <div className="px-4 py-2">
                    <div className="bg-surface-dark border border-border-dark p-3 rounded mb-4">
                        <div className="text-[10px] text-text-muted font-mono uppercase mb-1">Confianza Modelo</div>
                        <div className="text-2xl font-bold text-warning font-mono">{modelConf}%</div>

                        {/* UX Intervention: Visualization of Failure Rate */}
                        <div className="w-full flex h-1.5 mt-2 rounded-full overflow-hidden">
                            <div className="bg-warning h-full shadow-[0_0_10px_orange]" style={{ width: `${modelConf}%` }}></div>
                            <div className="bg-danger h-full" style={{ width: `${riskVal}%` }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] font-mono">
                            <span className="text-warning">Prob Vic</span>
                            <span className="text-danger">Riesgo ({riskVal}%)</span>
                        </div>
                    </div>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 bg-[#0F1216]">
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex items-center justify-center pb-32">
                    <div className="max-w-3xl w-full">
                        <div className="relative bg-[#151a21] border border-border-dark rounded-xl overflow-hidden shadow-2xl">
                            <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-warning to-transparent"></div>

                            {/* Header */}
                            <div className="p-8 text-center border-b border-border-dark bg-[radial-gradient(circle_at_top,#2b2210,transparent)]">
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2 text-shadow-gold">GOLD PICK DIARIO</h2>
                                <p className="text-text-muted text-sm font-mono max-w-lg mx-auto leading-relaxed">
                                    La <span className="text-[#FFD700] font-bold">mejor apuesta del día</span>. Seleccionada automáticamente por nuestra IA al detectar la mayor discrepancia matemática (Edge) y estabilidad del mercado.
                                </p>
                            </div>

                            <div className="p-8 flex flex-col items-center min-h-[400px]">
                                {!unlocked ? (
                                    <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500 w-full max-w-md">
                                        <div className="w-full bg-[#0d1014] border border-border-dark rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-text-muted uppercase">Partido</span>
                                                    <span className="text-lg font-bold text-white blur-sm select-none">{pick.match.replace(' vs ', ' vs ??? ')}</span>
                                                </div>
                                                <div className="flex flex-col text-right">
                                                    <span className="text-xs text-text-muted uppercase">Edge</span>
                                                    <span className="text-lg font-bold text-primary blur-sm select-none">+{pick.edge_percentage}%</span>
                                                </div>
                                            </div>
                                            <div className="h-[1px] w-full bg-border-dark"></div>
                                            <div className="flex items-center gap-3 text-xs text-text-secondary">
                                                <span className="material-symbols-outlined text-sm">shield</span>
                                                {/* Rephrase 'Insurance' to avoid risk-free implication */}
                                                <span>Protección de Varianza aplicada (En caso de fallar, el pick del día siguiente será GRATIS).</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleUnlock}
                                            disabled={thinking}
                                            className="w-full py-4 bg-gradient-to-r from-warning to-yellow-600 text-black font-bold text-lg rounded shadow-[0_0_20px_rgba(255,166,0,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-wait"
                                        >
                                            {thinking ? 'IA VALIDANDO...' : 'DESBLOQUEAR (ENTRADA PROTEGIDA)'}
                                        </button>

                                        <p className="text-[10px] text-text-muted text-center max-w-xs border border-danger/20 p-2 rounded bg-danger/5">
                                            <span className="text-danger font-bold">AVISO:</span> Alto edge ≠ resultado garantizado. La protección cubre varianza, no malas decisiones.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-full text-left">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-2xl font-bold text-white uppercase">{pick.match}</h3>
                                            <div className="px-3 py-1 bg-warning/20 text-warning border border-warning/30 rounded text-sm font-bold">PICK: {pick.bet_description}</div>
                                        </div>

                                        <div className="bg-[#0d1014] p-6 rounded border border-border-dark mb-6">
                                            <h4 className="text-xs font-bold text-text-muted uppercase mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary text-sm">psychology</span> RAZONAMIENTO GEMINI
                                            </h4>

                                            {(() => {
                                                try {
                                                    // Try to parse if it looks like JSON
                                                    const raw = pick.ai_analysis || "";
                                                    if (raw.trim().startsWith("{")) {
                                                        const parsed = JSON.parse(raw);

                                                        // Support new structure (analysis_text) or legacy (verdict/market)
                                                        const mainText = parsed.analysis_text || parsed.verdict || parsed.market;

                                                        return (
                                                            <div className="space-y-4 text-sm font-mono text-gray-300">
                                                                <p className="whitespace-pre-line leading-relaxed">
                                                                    {mainText || "Análisis no disponible."}
                                                                </p>

                                                                {/* Optional: Render extra fields if present */}
                                                                {parsed.key_insights && Array.isArray(parsed.key_insights) && (
                                                                    <div className="mt-4 border-t border-border-dark pt-3">
                                                                        <span className="text-primary font-bold uppercase text-[10px] block mb-2">Insights Clave</span>
                                                                        <ul className="list-disc pl-4 space-y-1">
                                                                            {parsed.key_insights.map((insight: string, idx: number) => (
                                                                                <li key={idx} className="text-xs text-text-secondary">{insight}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    } else {
                                                        // Fallback structure for plain text
                                                        return (
                                                            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-mono">
                                                                {raw || "Generando análisis en tiempo real..."}
                                                            </p>
                                                        );
                                                    }
                                                } catch (e) {
                                                    return (
                                                        <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line font-mono">
                                                            {pick.ai_analysis || "Generando análisis en tiempo real..."}
                                                        </p>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#1a232e] border border-primary/30 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(63,255,20,0.2)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 z-[100]">
                    <span className="material-symbols-outlined text-primary text-sm">{toast.type === 'success' ? 'check_circle' : 'info'}</span>
                    <span className="text-sm font-mono">{toast.message}</span>
                </div>
            )}

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                initialTier="pick"
                onSuccess={(tier) => {
                    setShowSuccess(true);
                    setUnlocked(true);
                }}
            />
            <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
        </div>
    );
};
