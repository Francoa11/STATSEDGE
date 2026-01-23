import React, { useState } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'plans' | 'selection' | 'upload'>('plans');
    const [selectedPlan, setSelectedPlan] = useState<{ id: 'pro' | 'elite'; name: string; price: string } | null>(null);

    // ⚠️ IMPORTANTE: CAMBIÁ ESTE NÚMERO POR EL TUYO REAL (con código de país)
    const WHATSAPP_NUMBER = "5491122334455";

    if (!isOpen) return null;

    const handlePaymentClick = (method: string) => {
        let message = "";
        const planName = selectedPlan?.name || "StatsEdge PRO";

        switch (method) {
            case 'MP':
                message = `👋 Hola! Quiero suscribirme al plan ${planName} en Pesos 🇦🇷 (Mercado Pago / Transferencia). ¿Me pasas el Alias?`;
                break;
            case 'GLOBAL':
                message = `👋 Hola! Quiero suscribirme al plan ${planName} desde el exterior 🌎 (Takenos / Transferencia USD). ¿Me pasas los datos?`;
                break;
            case 'CRYPTO':
                message = `👋 Hola! Quiero suscribirme al plan ${planName} con Cripto ₿ (USDT). ¿Me pasas la wallet?`;
                break;
        }
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // --- VISTA 1: SELECCIÓN DE PLAN ---
    if (step === 'plans') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-[#0F1216] border border-gray-800 rounded-2xl w-full max-w-4xl p-6 relative shadow-2xl overflow-y-auto max-h-[90vh]">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="text-center mb-10 mt-4">
                        <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Desbloquea el Potencial</h2>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">ELIGE TU NIVEL</h1>
                        <div className="h-1 w-16 bg-blue-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* PLAN PRO */}
                        <div className="bg-[#151a21] border border-gray-800 rounded-xl p-6 hover:border-blue-500/50 transition-all group flex flex-col relative overflow-hidden">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-white uppercase italic">Trader <span className="text-blue-500">PRO</span></h3>
                                <div className="text-3xl font-bold text-white mt-2">$20 <span className="text-sm font-normal text-gray-500">/ mes</span></div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-blue-500 text-base">check_circle</span>
                                    Acceso ilimitado a Value Bets (0.1% a 4.9% Edge)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-blue-500 text-base">check_circle</span>
                                    Filtros Avanzados (Liga, Mercado)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300">
                                    <span className="material-symbols-outlined text-blue-500 text-base">check_circle</span>
                                    Dashboard en Tiempo Real
                                </li>
                                <li className="flex items-center gap-3 text-sm text-gray-300 opacity-50">
                                    <span className="material-symbols-outlined text-gray-600 text-base">lock</span>
                                    Gold Pick Diario (Bloqueado)
                                </li>
                            </ul>

                            <button
                                onClick={() => {
                                    setSelectedPlan({ id: 'pro', name: 'Trader PRO', price: '$20' });
                                    setStep('selection');
                                }}
                                className="w-full py-3 border border-blue-500 text-blue-400 font-bold rounded-lg hover:bg-blue-500 hover:text-white transition-all uppercase tracking-wide"
                            >
                                Seleccionar Pro
                            </button>
                        </div>

                        {/* PLAN ELITE */}
                        <div className="bg-[#151a21] border border-[#FFD700] rounded-xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.05)] hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] transition-all flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-bold px-3 py-1 uppercase tracking-wider">Recomendado</div>

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-black text-white uppercase italic">Syndicate <span className="text-[#FFD700]">ELITE</span></h3>
                                <div className="text-3xl font-bold text-white mt-2">$50 <span className="text-sm font-normal text-gray-500">/ mes</span></div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <span className="material-symbols-outlined text-[#FFD700] text-base">verified</span>
                                    Todo lo incluido en PRO
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <span className="material-symbols-outlined text-[#FFD700] text-base">emoji_events</span>
                                    <span className="text-[#FFD700] font-bold">Gold Pick Diario</span> (Top 1% Edge)
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <span className="material-symbols-outlined text-[#FFD700] text-base">psychology</span>
                                    Razonamiento Profundo IA
                                </li>
                                <li className="flex items-center gap-3 text-sm text-white font-medium">
                                    <span className="material-symbols-outlined text-[#FFD700] text-base">calculate</span>
                                    Calculadora Kelly Completa
                                </li>
                            </ul>

                            <button
                                onClick={() => {
                                    setSelectedPlan({ id: 'elite', name: 'Syndicate ELITE', price: '$50' });
                                    setStep('selection');
                                }}
                                className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-black rounded-lg hover:scale-[1.02] transition-all uppercase tracking-wide shadow-lg"
                            >
                                Obtener Acceso Elite
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setStep('upload')}
                            className="text-gray-500 text-xs hover:text-white underline transition"
                        >
                            Ya tengo un plan, quiero subir comprobante
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA 3: PAGO (METODOS) ---
    if (step === 'selection') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-[#0F1216] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                    <button
                        onClick={() => setStep('plans')}
                        className="absolute top-4 left-4 text-gray-500 text-xs hover:text-white transition flex items-center gap-1"
                    >
                        ← Volver a Planes
                    </button>

                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="text-center mb-8 mt-6">
                        <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">{selectedPlan?.name}</h2>
                        <h1 className="text-2xl font-black text-white tracking-tight">MÉTODOS DE PAGO</h1>
                        <div className="h-1 w-12 bg-blue-500 mx-auto mt-3 rounded-full"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* MERCADO PAGO */}
                        <button
                            onClick={() => handlePaymentClick('MP')}
                            className="group flex items-center justify-between bg-[#1e293b]/50 hover:bg-[#009ee3]/10 border border-gray-700 hover:border-[#009ee3] p-4 rounded-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#009ee3]/20 text-[#009ee3] p-2.5 rounded-lg group-hover:scale-110 transition">
                                    <span className="material-symbols-outlined">qr_code_2</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">Mercado Pago / Pesos</p>
                                    <p className="text-xs text-gray-500 group-hover:text-[#009ee3]/80">Transferencia o Tarjeta 🇦🇷</p>
                                </div>
                            </div>
                            <span className="text-gray-500 text-xs">➜</span>
                        </button>

                        {/* GLOBAL / TAKENOS */}
                        <button
                            onClick={() => handlePaymentClick('GLOBAL')}
                            className="group flex items-center justify-between bg-[#1e293b]/50 hover:bg-[#22c55e]/10 border border-gray-700 hover:border-[#22c55e] p-4 rounded-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#22c55e]/20 text-[#22c55e] p-2.5 rounded-lg group-hover:scale-110 transition">
                                    <span className="material-symbols-outlined">public</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">Latam & Global USD</p>
                                    <p className="text-xs text-gray-500 group-hover:text-[#22c55e]/80">Takenos / Transferencia 🌎</p>
                                </div>
                            </div>
                            <span className="text-gray-500 text-xs">➜</span>
                        </button>

                        {/* CRIPTO */}
                        <button
                            onClick={() => handlePaymentClick('CRYPTO')}
                            className="group flex items-center justify-between bg-[#1e293b]/50 hover:bg-[#f59e0b]/10 border border-gray-700 hover:border-[#f59e0b] p-4 rounded-xl transition-all duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#f59e0b]/20 text-[#f59e0b] p-2.5 rounded-lg group-hover:scale-110 transition">
                                    <span className="material-symbols-outlined">currency_bitcoin</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-white text-sm">Cripto / USDT</p>
                                    <p className="text-xs text-gray-500 group-hover:text-[#f59e0b]/80">Binance Pay / Wallet ₿</p>
                                </div>
                            </div>
                            <span className="text-gray-500 text-xs">➜</span>
                        </button>

                        <div className="relative my-4 flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                            <div className="relative bg-[#0F1216] px-2 text-[10px] uppercase text-gray-500 font-mono">¿Ya pagaste?</div>
                        </div>

                        <button
                            onClick={() => setStep('upload')}
                            className="w-full border-2 border-dashed border-gray-700 hover:border-white/50 text-gray-400 hover:text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:animate-bounce">upload_file</span>
                            <span className="text-xs font-bold uppercase tracking-wider">Subir Comprobante</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA 4: SUBIR COMPROBANTE ---
    if (step === 'upload') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-[#0F1216] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                    <button
                        onClick={() => setStep(selectedPlan ? 'selection' : 'plans')}
                        className="absolute top-4 left-4 text-gray-500 text-xs hover:text-white transition flex items-center gap-1"
                    >
                        ← Volver
                    </button>

                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>

                    <div className="mt-8 text-center">
                        <h2 className="text-white text-xl font-bold mb-2">Subir Comprobante</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Ingresá tu mail y adjuntá la captura para activar tu cuenta PRO manualmente.
                        </p>
                    </div>

                    <form
                        className="flex flex-col gap-4"
                        onSubmit={(e) => {
                            e.preventDefault();
                            alert("¡Comprobante enviado! Te contactaremos en breve para darte acceso.");
                            onClose();
                        }}
                    >
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-bold ml-1">Tu Email</label>
                            <input
                                type="email"
                                placeholder="ejemplo@email.com"
                                className="w-full bg-[#0a0f18] border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500 transition mt-1"
                                required
                            />
                        </div>

                        <div className="border-2 border-dashed border-gray-700 hover:border-blue-500/50 p-8 rounded-xl text-center transition cursor-pointer group bg-[#0a0f18]">
                            <span className="text-2xl mb-2 block group-hover:scale-110 transition">📄</span>
                            <p className="text-gray-500 text-sm group-hover:text-blue-400">Clic para subir imagen o PDF</p>
                            <input type="file" className="hidden" id="fileUpload" accept="image/*,.pdf" />
                            <label htmlFor="fileUpload" className="absolute inset-0 cursor-pointer"></label>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold p-3.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 mt-2">
                            Enviar para Verificación
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return null;
};
