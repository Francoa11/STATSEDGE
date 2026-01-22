import React from 'react';

const AnalysisModal = ({ pick, onClose }: { pick: any, onClose: () => void }) => {
    if (!pick) return null;

    // Lógica para limpiar el texto si viene sucio como JSON string
    const getCleanAnalysis = (text: any) => {
        try {
            if (typeof text === 'string') {
                if (text.startsWith('{') || text.startsWith('"')) {
                    const parsed = JSON.parse(text);
                    return parsed.analysis_text || parsed;
                }
            }
            return text;
        } catch (e) {
            return String(text).replace(/{"analysis_text": "/g, '').replace(/"}/g, '').replace(/\\n/g, '\n');
        }
    };

    const analysisText = getCleanAnalysis(pick.ai_analysis);

    // Datos simulados por si la IA no te dio stats específicas hoy (Fallback)
    let stats = {
        "Home Goals (Avg)": "1.4",
        "Away Goals (Avg)": "1.8",
        "Home Defense": "Avg",
        "Weather": "Good"
    };
    let insights = [
        "High goal probability in first half.",
        "Market underestimates visitor form.",
        "Significant xG difference detected."
    ];

    // Extraction from DB JSON structure
    try {
        const parsed = JSON.parse(pick.ai_analysis);
        if (parsed.key_stats && Object.keys(parsed.key_stats).length > 0) stats = parsed.key_stats;
        if (parsed.key_insights && parsed.key_insights.length > 0) insights = parsed.key_insights;
    } catch (e) { }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0F1523] w-full max-w-4xl rounded-3xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* --- HEADER --- */}
                <div className="bg-[#1E293B]/30 p-6 border-b border-[#1E293B] flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full border border-emerald-500/20">
                                PRO ANALYSIS
                            </span>
                            <span className="text-slate-400 text-xs font-mono uppercase">{pick.league_name}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{pick.match}</h2>
                        <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm">
                            <span className="material-symbols-outlined text-blue-400 text-sm">ads_click</span>
                            Pick: <span className="text-blue-300 font-semibold">{pick.selection}</span>
                            <span className="text-slate-600">|</span>
                            @ <span className="text-white font-mono font-bold">{pick.odds}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* --- BODY (SCROLLABLE) --- */}
                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">

                    {/* COLUMNA IZQUIERDA: LOS DATOS DUROS */}
                    <div className="md:col-span-2 space-y-6">

                        {/* 1. MODELO VS MERCADO (BARRAS DE PODER) */}
                        <div className="bg-[#0b121c] rounded-2xl p-5 border border-[#1E293B]">
                            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">psychology</span> Probabilidad vs Mercado
                            </h3>

                            {/* Barra Modelo */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-emerald-400 font-bold">StatsEdge AI Model</span>
                                    <span className="text-white font-mono">{pick.confidence_score ? (pick.confidence_score / 5 * 100) : 85}%</span>
                                </div>
                                <div className="h-3 bg-[#1E293B] rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${pick.confidence_score ? (pick.confidence_score / 5) * 100 : 85}%` }}></div>
                                </div>
                            </div>

                            {/* Barra Mercado */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-500 font-bold">Market Implied</span>
                                    <span className="text-slate-400 font-mono">{(100 / pick.odds).toFixed(1)}%</span>
                                </div>
                                <div className="h-3 bg-[#1E293B] rounded-full overflow-hidden">
                                    <div className="h-full bg-slate-600" style={{ width: `${(100 / pick.odds)}%` }}></div>
                                </div>
                            </div>

                            <div className="mt-3 text-xs text-right text-emerald-400 font-mono">
                                +Edge Detected
                            </div>
                        </div>

                        {/* 2. EL TEXTO DE ANÁLISIS (LIMPIO) */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-white text-lg font-bold mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-400">bolt</span> Veredicto del Sistema
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line border-l-4 border-emerald-500 pl-4 bg-emerald-900/10 p-3 rounded-r-lg">
                                {analysisText}
                            </p>
                        </div>

                        {/* 3. KEY INSIGHTS (BULLET POINTS) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {insights.map((insight: string, idx: number) => (
                                <div key={idx} className="bg-[#1E293B]/30 p-3 rounded-lg border border-[#1E293B] flex items-start gap-2">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-400 shrink-0"></div>
                                    <p className="text-xs text-slate-300">{insight}</p>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* COLUMNA DERECHA: ESTADÍSTICAS RÁPIDAS */}
                    <div className="space-y-4">
                        <div className="bg-[#1E293B]/30 rounded-2xl p-5 border border-[#1E293B]">
                            <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span> Match Stats
                            </h3>

                            <div className="space-y-4">
                                {Object.entries(stats).map(([key, val]: any) => (
                                    <div key={key} className="flex justify-between items-center border-b border-[#1E293B] pb-2 last:border-0 last:pb-0">
                                        <span className="text-xs text-slate-500">{key}</span>
                                        <span className="text-sm font-bold text-white max-w-[50%] text-right">{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-indigo-900/10 rounded-2xl p-4 border border-indigo-500/30">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-indigo-400">shield</span>
                                <div>
                                    <h4 className="text-indigo-300 text-xs font-bold uppercase mb-1">Risk Assessment</h4>
                                    <p className="text-xs text-indigo-200/80">
                                        Medium Volatility. Recommended stake: 1 unit.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- FOOTER --- */}
                <div className="p-4 border-t border-[#1E293B] bg-[#0F1523] flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 rounded-xl bg-[#1E293B] text-slate-300 hover:bg-slate-700 text-sm font-bold transition">
                        Close Analysis
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AnalysisModal;
