import React, { useState } from 'react';
import { generateHypeImage } from '../services/geminiService';

export const EliteSyndicate: React.FC = () => {
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string; type?: 'info' | 'success' } | null>(null);

    const showToast = (message: string, type: 'info' | 'success' = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleGenerateHype = async () => {
        setGenerating(true);
        try {
            const win = window as any;
            if (win.aistudio) {
                const hasKey = await win.aistudio.hasSelectedApiKey();
                if (!hasKey) await win.aistudio.openSelectKey();
            }
            const imageUrl = await generateHypeImage("Dark cinematic football betting poster, neon red, elite syndicate, ominous, 4k", "1K");
            if (imageUrl) setGeneratedImage(imageUrl);
        } catch (e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0F172A] text-white font-display overflow-hidden selection:bg-primary selection:text-black">
            <aside className="w-64 hidden md:flex flex-col border-r border-border-dark bg-[#0F172A] flex-shrink-0 z-20">
                <div className="p-6 flex items-center gap-3">
                    <span className="text-lg font-bold tracking-tight text-white uppercase">Elite<span className="text-danger">Syndicate</span></span>
                </div>
            </aside>
            <main className="flex-1 flex flex-col min-w-0 bg-[#0F172A] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto z-10 p-8 pb-32">
                    <div className="max-w-[1600px] mx-auto flex flex-col gap-8">

                        {/* Header & Hype Gen */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-border-dark/50 pb-6">
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-2">Acceso Sindicato</h1>
                                <p className="text-gray-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-2 h-2 bg-danger rounded-full animate-pulse"></span>
                                    Feed En Vivo Alto Riesgo
                                </p>
                            </div>
                            <button
                                onClick={handleGenerateHype}
                                disabled={generating}
                                className="text-xs font-mono text-text-muted border border-border-dark px-3 py-1 rounded hover:text-white transition-colors"
                            >
                                {generating ? 'Creando Activo...' : 'Generar Activo Hype'}
                            </button>
                        </div>

                        {/* Transparency Panel (Metrics) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-[#121810] border border-border-dark p-4 rounded-lg">
                                <div className="text-[10px] text-text-muted uppercase mb-1">ROI Sindicato (Año)</div>
                                <div className="text-2xl font-mono font-bold text-primary">+18.4%</div>
                            </div>
                            <div className="bg-[#121810] border border-border-dark p-4 rounded-lg">
                                <div className="text-[10px] text-text-muted uppercase mb-1">Tasa Acierto</div>
                                <div className="text-2xl font-mono font-bold text-white">58.2%</div>
                            </div>
                            <div className="bg-[#121810] border border-border-dark p-4 rounded-lg">
                                <div className="text-[10px] text-text-muted uppercase mb-1">Máx Drawdown</div>
                                <div className="text-2xl font-mono font-bold text-danger">-4.1%</div>
                            </div>
                            <div className="bg-[#121810] border border-border-dark p-4 rounded-lg">
                                <div className="text-[10px] text-text-muted uppercase mb-1">Superar CLV</div>
                                <div className="text-2xl font-mono font-bold text-primary">92%</div>
                            </div>
                        </div>

                        {generatedImage && (
                            <div className="w-full bg-surface-dark border border-border-dark rounded-lg p-4 flex flex-col items-center">
                                <img src={generatedImage} alt="Generated Hype" className="rounded shadow-2xl max-h-[300px]" />
                            </div>
                        )}

                        {/* Locked Content Area */}
                        <div className="relative bg-surface-dark border border-border-dark rounded-lg overflow-hidden min-h-[400px]">
                            <div className="absolute inset-0 z-10 bg-[#0F172A]/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                                <span className="material-symbols-outlined text-4xl text-danger mb-4">lock</span>
                                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-2">Acceso Restringido</h3>
                                <p className="text-text-muted max-w-md mb-6">
                                    Este feed está reservado para socios Sindicato. Las selecciones aquí tienen {'>'} 10% de edge y perfiles de alta varianza.
                                </p>
                                <button
                                    onClick={() => showToast("Solicitud enviada. Un oficial de cumplimiento le contactará.", "success")}
                                    className="px-8 py-3 bg-danger text-white font-bold rounded shadow-[0_0_20px_rgba(255,77,77,0.4)] hover:bg-red-600 transition-colors"
                                >
                                    Solicitar Ingreso Sindicato
                                </button>
                            </div>

                            {/* Blurred Background Content */}
                            <div className="p-6 opacity-20 filter blur-sm">
                                <table className="w-full text-left">
                                    <thead><tr className="text-left text-gray-500"><th>Partido</th><th>Selección</th><th>Stake</th></tr></thead>
                                    <tbody className="text-white text-lg font-bold">
                                        <tr><td>Man City vs Liverpool</td><td>Over 3.5</td><td>5u</td></tr>
                                        <tr><td>Napoli vs Lazio</td><td>Napoli -1</td><td>3u</td></tr>
                                        <tr><td>Boca vs River</td><td>Red Card Yes</td><td>1u</td></tr>
                                    </tbody>
                                </table>
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
