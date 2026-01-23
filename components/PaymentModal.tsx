import React, { useState } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Opcional por ahora
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'selection' | 'upload'>('selection');

    // ⚠️ IMPORTANTE: CAMBIÁ ESTE NÚMERO POR EL TUYO REAL (con código de país)
    const WHATSAPP_NUMBER = "5491122334455";

    if (!isOpen) return null;

    const handlePaymentClick = (method: string) => {
        let message = "";
        switch (method) {
            case 'MP':
                message = "👋 Hola! Quiero suscribirme a StatsEdge PRO en Pesos 🇦🇷 (Mercado Pago / Transferencia). ¿Me pasas el Alias?";
                break;
            case 'GLOBAL':
                message = "👋 Hola! Quiero suscribirme a StatsEdge PRO desde el exterior 🌎 (Takenos / Transferencia USD). ¿Me pasas los datos?";
                break;
            case 'CRYPTO':
                message = "👋 Hola! Quiero suscribirme a StatsEdge PRO con Cripto ₿ (USDT). ¿Me pasas la wallet?";
                break;
        }
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    };

    // --- VISTA: FORMULARIO DE CARGA DE COMPROBANTE ---
    if (step === 'upload') {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
                <div className="bg-[#0F1216] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                    <button
                        onClick={() => setStep('selection')}
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

                    {/* Podés conectar este form a Formspree.io más adelante */}
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

    // --- VISTA: SELECCIÓN DE PAGO (PRINCIPAL) ---
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="bg-[#0F1216] border border-gray-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">

                {/* Header */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="text-center mb-8 mt-2">
                    <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Suscripción Mensual</h2>
                    <h1 className="text-2xl font-black text-white tracking-tight">ELEGÍ CÓMO PAGAR</h1>
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

                    {/* DIVIDER */}
                    <div className="relative my-4 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
                        <div className="relative bg-[#0F1216] px-2 text-[10px] uppercase text-gray-500 font-mono">¿Ya pagaste?</div>
                    </div>

                    {/* BOTÓN YA PAGUÉ -> CAMBIA ESTADO A 'UPLOAD' */}
                    <button
                        onClick={() => setStep('upload')}
                        className="w-full border-2 border-dashed border-gray-700 hover:border-white/50 text-gray-400 hover:text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:animate-bounce">upload_file</span>
                        <span className="text-xs font-bold uppercase tracking-wider">Subir Comprobante</span>
                    </button>
                </div>

                <p className="text-center text-[10px] text-gray-600 mt-6">
                    StatsEdge Secure Payments • SSL Encrypted
                </p>
            </div>
        </div>
    );
};
