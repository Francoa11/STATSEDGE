import React, { useRef, useState } from 'react';
import { analyzeBetSlip } from '../services/geminiService';

export const ProAnalyst: React.FC = () => {
    // Mock data for the Trading Terminal
    const opportunities = [
        { match: 'Man City vs Liverpool', odds: '2.10', p_model: '56.2%', p_implied: '47.6%', edge: '+8.6%', kelly: '2.5%', signal: 'VALUE' },
        { match: 'Arsenal vs Brighton', odds: '1.85', p_model: '58.0%', p_implied: '54.0%', edge: '+4.0%', kelly: '1.2%', signal: 'VALUE' },
        { match: 'Chelsea vs Fulham', odds: '1.60', p_model: '62.0%', p_implied: '62.5%', edge: '-0.5%', kelly: '0%', signal: 'NO BET' },
        { match: 'Barca vs Valencia', odds: '2.40', p_model: '41.0%', p_implied: '41.6%', edge: '-0.6%', kelly: '0%', signal: 'NO BET' },
        { match: 'Bayern vs Dortmund', odds: '1.95', p_model: '55.0%', p_implied: '51.2%', edge: '+3.8%', kelly: '1.1%', signal: 'VALUE' },
    ];

    const [filterValue, setFilterValue] = useState(false);
    const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

    const showToast = (message: string, type: 'info' | 'success' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const filteredOpportunities = filterValue
        ? opportunities.filter(o => o.signal === 'VALUE')
        : opportunities;

    return (
        <div className="bg-[#0F172A] text-slate-100 font-display overflow-hidden h-screen flex w-full">
            {/* Pro Sidebar */}
            <aside className="w-16 lg:w-20 flex flex-col border-r border-border-dark bg-[#0F1216] shrink-0 items-center py-6 gap-6 z-20">
                <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-black font-bold shadow-glow">PA</div>
                <div className="flex flex-col gap-4 w-full items-center">
                    <button onClick={() => showToast("Vista de Tabla Activa", "success")} className="p-2 rounded bg-white/10 text-primary"><span className="material-symbols-outlined">table_chart</span></button>
                    <button onClick={() => showToast("Gráficos Avanzados: Próximamente")} className="p-2 rounded hover:bg-white/5 text-text-muted"><span className="material-symbols-outlined">show_chart</span></button>
                    <button onClick={() => showToast("Distribución de Cartera: Próximamente")} className="p-2 rounded hover:bg-white/5 text-text-muted"><span className="material-symbols-outlined">pie_chart</span></button>
                </div>
            </aside>

            {/* Main Terminal */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative">
                {/* Header */}
                <header className="h-14 border-b border-border-dark bg-[#0F1216] flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold uppercase tracking-widest text-white">Analista Pro <span className="text-primary">// Terminal</span></h1>
                        <div className="h-4 w-[1px] bg-border-dark"></div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Datos de Mercado en Vivo (Latencia: 45ms)
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            {/* UX Tweak: Changed "Global Edge" to "Model Performance" to reduce immediate reward anticipation */}
                            <div className="text-[10px] text-text-muted uppercase">Rendimiento Modelo (Año)</div>
                            <div className="text-xs font-mono font-bold text-white">+14.2u</div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Data Table */}
                    <div className="flex-1 bg-[#0F172A] p-6 overflow-y-auto border-r border-border-dark pb-32">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Oportunidades en Vivo</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterValue(!filterValue)}
                                    className={`px-3 py-1 border rounded text-xs transition-colors ${filterValue ? 'bg-primary text-black border-primary font-bold' : 'bg-surface-dark border-border-dark text-white hover:border-text-muted'}`}
                                >
                                    {filterValue ? 'Mostrar Todos' : 'Filtro: Solo Valor'}
                                </button>
                            </div>
                        </div>

                        <div className="rounded border border-border-dark bg-[#121810] overflow-hidden shadow-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border-dark bg-[#182016] text-[10px] uppercase text-text-muted font-bold tracking-wider">
                                        <th className="px-4 py-3">Partido</th>
                                        <th className="px-4 py-3 text-right">Cuota (Mejor)</th>
                                        <th className="px-4 py-3 text-right text-white">P(Modelo)</th>
                                        <th className="px-4 py-3 text-right">P(Implícita)</th>
                                        <th className="px-4 py-3 text-right">Edge %</th>
                                        {/* New Column: Kelly Sizing to contextulize risk immediately */}
                                        <th className="px-4 py-3 text-right text-warning">Rec. Kelly</th>
                                        <th className="px-4 py-3 text-right">Señal</th>
                                        <th className="px-4 py-3 text-center">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-mono divide-y divide-border-dark">
                                    {filteredOpportunities.map((opp, i) => {
                                        const isValue = opp.signal === 'VALUE';
                                        return (
                                            <tr key={i} className={`transition-colors group ${isValue ? 'hover:bg-white/[0.03]' : 'opacity-40 grayscale hover:opacity-100'}`}>
                                                <td className={`px-4 py-3 font-medium transition-colors ${isValue ? 'text-white group-hover:text-primary' : 'text-gray-500'}`}>{opp.match}</td>
                                                <td className="px-4 py-3 text-right text-white">{opp.odds}</td>
                                                <td className={`px-4 py-3 text-right ${isValue ? 'text-primary' : 'text-gray-500'}`}>{opp.p_model}</td>
                                                <td className="px-4 py-3 text-right text-text-muted">{opp.p_implied}</td>
                                                <td className={`px-4 py-3 text-right font-bold ${opp.edge.startsWith('+') ? 'text-primary' : 'text-danger'}`}>{opp.edge}</td>
                                                <td className="px-4 py-3 text-right text-warning">{opp.kelly}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isValue ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-transparent text-gray-600 border border-gray-800'}`}>
                                                        {opp.signal}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {isValue ? (
                                                        <button
                                                            onClick={() => showToast(`Analizando ${opp.match}...`, "info")}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">analytics</span>
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-800 text-[10px] uppercase">Pass</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-[10px] text-text-muted text-center font-mono">
                            Las filas atenuadas representan precios de mercado eficientes (Sin Edge). El "Sesgo de Acción" es el enemigo del beneficio.
                        </div>
                    </div>

                    {/* Right: Visualization Panel */}
                    <div className="w-[380px] bg-[#0F1216] p-6 flex flex-col gap-6 overflow-y-auto pb-32">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">radar</span> Varianza Modelo
                            </h3>
                            <div className="aspect-square bg-[#182016] border border-border-dark rounded-lg relative flex items-center justify-center p-4">
                                {/* CSS Radar Chart Mock */}
                                <div className="absolute inset-0 m-8 border border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 m-16 border border-white/10 rounded-full"></div>
                                <div className="absolute inset-0 m-24 border border-white/10 rounded-full"></div>
                                <div className="relative w-full h-full opacity-60">
                                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(63,255,20,0.5)]">
                                        <polygon points="50,10 90,40 70,90 30,90 10,40" fill="rgba(63,255,20,0.2)" stroke="#3fff14" strokeWidth="1" />
                                    </svg>
                                </div>
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-text-muted">Ataque</div>
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-text-muted">Defensa</div>
                                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">Forma</div>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-text-muted">Valor</div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm text-primary">ssid_chart</span> Flujo xG (Ult 5)
                            </h3>
                            <div className="h-32 bg-[#182016] border border-border-dark rounded-lg relative flex items-end p-2 gap-1">
                                {[40, 60, 30, 80, 55, 70, 45, 90, 65, 50].map((h, i) => (
                                    <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/80 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">{h / 10} xG</div>
                                    </div>
                                ))}
                            </div>
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
