import React from 'react';

const PickCard = ({ pick }: { pick: any }) => {
    const isHighEdge = pick.edge_percentage > 9; // High Edge threshold matches image logic (+10.5%)

    // Analisis IA (Texto inferior con icono)
    // Clean redundant text
    let displayAnalysis = pick.ai_analysis;
    try {
        const parsed = JSON.parse(pick.ai_analysis);
        if (parsed.analysis_text) displayAnalysis = parsed.analysis_text;
    } catch (e) { }

    // Limpieza para que quede como en la imagen: "📊 Oportunidad detectada... @ 1.88"
    const analysisText = "Oportunidad detectada por Modelo"; // Placeholder static or dynamic

    // Colores exactos de la imagen reference
    // Background Card: #0f1623 (Azul muy oscuro casi negro, typical dashboard bg)
    // Selection Color: #22c55e (Green-500 equivalent) or a bit brighter neon green like image
    // League Badge: #1f2937 (Slate-800) with lighter text

    return (
        <div className="w-full mb-3 cursor-pointer group">
            <div className="relative bg-[#0F1523] border border-[#1E293B] hover:border-[#334155] rounded-lg p-5 shadow-sm transition-all duration-200">

                <div className="flex justify-between items-start">

                    {/* --- Left Column --- */}
                    <div className="flex flex-col gap-2 flex-1 pr-4">

                        {/* 1. League Badge (Exact Match Style) */}
                        <div>
                            <span className="inline-block bg-[#1E293B] text-[#94A3B8] text-[11px] font-medium px-2 py-1 rounded-[4px]">
                                {pick.league_name}
                            </span>
                        </div>

                        {/* 2. Match Title */}
                        <h3 className="text-white font-bold text-[17px] leading-tight mt-1">
                            {pick.match}
                        </h3>

                        {/* 3. Selection (Green Text) */}
                        <div className="text-[15px] font-bold text-[#4ADE80] mt-0.5">
                            {pick.selection}
                        </div>

                        {/* 4. Footer Line with Icon */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-[16px]">bar_chart</span>
                            {/* Texto Corregido sin "manualmente" */}
                            <span className="text-[11px] font-medium text-slate-300">
                                Oportunidad detectada IA: ALTA <span className="text-slate-500 mx-1">@</span> <span className="text-[#4ADE80] font-bold">{pick.odds.toFixed(2)}</span>
                            </span>
                        </div>

                    </div>

                    {/* --- Right Column: The Edge --- */}
                    <div className="flex flex-col items-end justify-center min-w-[80px]">
                        <span className="text-[22px] font-black text-[#4ADE80] tracking-tighter leading-none uppercase">
                            {pick.edge_percentage > 11 ? 'GOLD' : pick.edge_percentage > 9 ? 'ALTA' : 'MEDIA'}
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                            VALOR
                        </span>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PickCard;
