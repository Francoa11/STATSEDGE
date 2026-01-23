import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (tier: string) => void;
    initialTier?: 'pro' | 'pick';
}

type PaymentMethod = 'stripe' | 'mercadopago' | 'paypal' | 'crypto';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, initialTier = 'pro' }) => {
    const [processing, setProcessing] = useState<string | null>(null);
    const [pickMethod, setPickMethod] = useState<PaymentMethod>('mercadopago');
    const [proMethod, setProMethod] = useState<PaymentMethod>('mercadopago');
    const [activeSlide, setActiveSlide] = useState(0);

    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && scrollRef.current) {
            // Scroll to the target slide on open
            setTimeout(() => {
                if (scrollRef.current) {
                    const width = scrollRef.current.offsetWidth;
                    let targetIndex = 1; // Default to Pro (index 1)

                    if (initialTier === 'pick') targetIndex = 2; // GoldPick is index 2

                    // 0.85 factor for card width logic used in handleScroll
                    const scrollPos = targetIndex * (width * 0.85);

                    scrollRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
                    setActiveSlide(targetIndex);
                }
            }, 100);
        }
    }, [isOpen, initialTier]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollLeft = e.currentTarget.scrollLeft;
        const width = e.currentTarget.offsetWidth;
        // Simple logic to determine which slide is mostly visible (0, 1, 2)
        const index = Math.round(scrollLeft / (width * 0.85)); // 0.85 factor for card width
        setActiveSlide(Math.min(Math.max(index, 0), 2));
    };

    if (!isOpen) return null;

    const getPrice = (type: 'pick' | 'pro', method: PaymentMethod) => {
        const isARS = method === 'mercadopago';
        const isCrypto = method === 'crypto';

        if (type === 'pick') {
            if (isARS) return { amount: 18500, label: '$18.500 ARS', currency: 'ARS' };
            if (isCrypto) return { amount: 13.49, label: '$13.49 USDT', currency: 'USD' }; // ~10% Discount
            return { amount: 14.99, label: '$14.99 USD', currency: 'USD' };
        }
        // Pro
        if (isARS) return { amount: 30000, label: '$30.000 ARS', currency: 'ARS' };
        if (isCrypto) return { amount: 17.99, label: '$17.99 USDT', currency: 'USD' }; // ~10% Discount
        return { amount: 19.99, label: '$19.99 USD', currency: 'USD' };
    };

    const handlePurchase = async (tier: string, method: PaymentMethod) => {
        setProcessing(`${tier}-${method}`);
        const priceData = getPrice(tier as 'pick' | 'pro', method);

        // Simulation Logic
        setTimeout(() => {
            let message = '';
            switch (method) {
                case 'mercadopago': message = 'Redirigiendo a App Mercado Pago...'; break;
                case 'paypal': message = 'Abriendo PayPal Gateway...'; break;
                case 'crypto': message = 'Generando Wallet USDT (TRC20)...'; break;
                default: message = 'Conectando Stripe Secure...';
            }
            alert(`${message}\nMonto: ${priceData.label}\n(Simulación Exitosa)`);

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            fetch(`${API_URL}/buy-access`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 'demo-user-uuid',
                    item_type: tier === 'pro' ? 'subscription' : 'one_time',
                    item_id: tier,
                    price: priceData.amount,
                    currency: priceData.currency
                })
            }).then(() => {
                onSuccess(tier);
                onClose();
                setProcessing(null);
            });

        }, 1500);
    };

    const getMethodLabel = (method: PaymentMethod) => {
        switch (method) {
            case 'mercadopago': return 'Precio en Pesos (Argentina)';
            case 'stripe': return 'Precio en Dólares (Internacional)';
            case 'paypal': return 'Precio en Dólares (Internacional)';
            case 'crypto': return 'Pago Global (USDT) • 10% OFF';
            default: return 'Selecciona un método';
        }
    };

    const MethodSelector = ({ selected, onSelect, colorClass }: { selected: PaymentMethod, onSelect: (m: PaymentMethod) => void, colorClass: string }) => (
        <>
            <div className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-1 h-3 transition-all">
                {getMethodLabel(selected)}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                    onClick={() => onSelect('mercadopago')}
                    className={`h-12 rounded border flex items-center justify-center gap-1.5 transition-all ${selected === 'mercadopago' ? `bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]` : 'border-white/10 text-text-muted hover:bg-white/5'}`}
                    title="Mercado Pago"
                >
                    <span className="material-symbols-outlined text-lg">qr_code_2</span>
                    <span className="text-[9px] font-bold uppercase">MERCADO PAGO</span>
                </button>
                <button
                    onClick={() => onSelect('stripe')}
                    className={`h-12 rounded border flex items-center justify-center gap-1.5 transition-all ${selected === 'stripe' ? `${colorClass} bg-white/10` : 'border-white/10 text-text-muted hover:bg-white/5'}`}
                    title="Tarjeta"
                >
                    <span className="material-symbols-outlined text-lg">credit_card</span>
                    <span className="text-[9px] font-bold uppercase">Tarjeta</span>
                </button>
                <button
                    onClick={() => onSelect('paypal')}
                    className={`h-12 rounded border flex items-center justify-center gap-1.5 transition-all ${selected === 'paypal' ? 'bg-[#003087]/20 border-[#003087] text-[#003087] shadow-[0_0_10px_rgba(0,48,135,0.2)]' : 'border-white/10 text-text-muted hover:bg-white/5'}`}
                    title="PayPal"
                >
                    <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
                    <span className="text-[9px] font-bold uppercase">PayPal</span>
                </button>
                <button
                    onClick={() => onSelect('crypto')}
                    className={`h-12 rounded border flex items-center justify-center gap-1.5 transition-all relative overflow-hidden ${selected === 'crypto' ? 'bg-[#F3BA2F]/20 border-[#F3BA2F] text-[#F3BA2F] shadow-[0_0_10px_rgba(243,186,47,0.2)]' : 'border-white/10 text-text-muted hover:bg-white/5'}`}
                    title="USDT"
                >
                    <span className="material-symbols-outlined text-lg">currency_bitcoin</span>
                    <span className="text-[9px] font-bold uppercase">USDT</span>
                    {selected === 'crypto' && <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-bl animate-pulse shadow-glow-sm"></span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md px-4 py-6 md:p-4 overflow-y-auto">
            <div className="bg-[#0F1216] border border-surface-border rounded-2xl w-full max-w-[1200px] p-4 md:p-8 relative flex flex-col shadow-2xl my-auto md:h-auto">
                {/* Header Row with Flexbox for alignment */}
                <div className="flex items-start md:items-center justify-between mb-6 md:mb-8 shrink-0 relative z-10 w-full">
                    {/* Spacer to balance the close button and keep title centered */}
                    <div className="w-10 md:w-12 h-0"></div>

                    <div className="text-center flex-1 px-2">
                        <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter">PLANES PRO & GOLD PICKS</h2>
                        <div className="h-1 w-16 md:w-24 bg-primary mx-auto mt-2 md:mt-3 rounded-full shadow-[0_0_15px_#3fff14]"></div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors bg-black/80 rounded-full p-2 hover:bg-black border border-white/10 shadow-lg flex-shrink-0"
                    >
                        <span className="material-symbols-outlined text-xl md:text-2xl">close</span>
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 w-full pb-6 md:pb-0 md:grid md:grid-cols-3 scrollbar-hide"
                    onScroll={handleScroll}
                >

                    {/* OPTION 1: FREE / CURRENT PLAN (ORDER 1) */}
                    <div className="min-w-[85vw] md:min-w-0 snap-center border border-white/5 bg-surface-dark/30 rounded-xl p-5 md:p-6 flex flex-col relative opacity-70 hover:opacity-100 transition-opacity order-1 md:order-1">
                        <div className="mb-4">
                            <h3 className="text-sm md:text-base font-bold text-gray-500 uppercase tracking-widest mb-1">Nivel Inicial</h3>
                            <div className="text-xl md:text-2xl font-bold text-white mb-1">Invitado</div>
                            <div className="text-xs md:text-sm font-mono text-text-muted">Acceso Limitado</div>
                        </div>

                        <div className="flex-1">
                            <ul className="space-y-3 mb-6">
                                <li className="text-xs text-gray-400 flex gap-3 items-start"><span className="text-gray-500 font-bold mt-0.5">✓</span> <span>Datos (15min delay)</span></li>
                                <li className="text-xs text-gray-400 flex gap-3 items-start"><span className="text-gray-500 font-bold mt-0.5">✓</span> <span>3 Partidos Gratis/día</span></li>
                                <li className="text-xs text-gray-400 flex gap-3 items-start"><span className="text-gray-500 font-bold mt-0.5">✓</span> <span>Publicidad en App</span></li>
                            </ul>
                        </div>

                        <div className="mt-auto pt-4">
                            <button disabled className="w-full py-3 rounded bg-white/5 text-gray-500 font-bold font-mono text-xs border border-white/5 cursor-not-allowed">
                                PLAN ACTUAL
                            </button>
                        </div>
                    </div>

                    {/* OPTION 2: PRO SUBSCRIPTION (ORDER 2 - CENTER) */}
                    <div className="min-w-[85vw] md:min-w-0 snap-center border border-primary/40 bg-[#0F172A] rounded-xl p-5 md:p-6 flex flex-col relative shadow-[0_0_30px_rgba(63,255,20,0.05)] transform md:scale-[1.02] ring-1 ring-primary/20 order-2 md:order-2">
                        <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">Mejor Valor</div>

                        <div className="mb-4">
                            <h3 className="text-sm md:text-base font-bold text-primary uppercase tracking-widest mb-1">Membresía Mensual</h3>
                            <div className="text-xl md:text-2xl font-black text-white mb-1">STATSEDGE PRO</div>
                            <div className="text-xs md:text-sm font-mono text-primary/80">Acceso Ilimitado a Todo</div>
                        </div>

                        <ul className="space-y-3 mb-6 flex-1 overflow-y-auto scrollbar-hide max-h-[180px] md:max-h-[220px]">
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Acceso Multideporte Total</strong>: Fútbol, Tenis, Básquet y más.</span></li>
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Scanner de Edge</strong>: Detección de cuotas mal ajustadas por las casas (Value Bets).</span></li>
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Modelos de IA Predictiva</strong>: Acceso ilimitado al análisis profundo de IA + xG Data.</span></li>
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Rastreo de "Smart Money"</strong>: Alertas cuando el volumen de apuestas mueve el mercado drásticamente.</span></li>
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Picks de Alto Valor (High Edge)</strong>: Recibe solo las oportunidades con &gt;5% de ventaja matemática.</span></li>
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Análisis de IA en Tiempo Real</strong>: Explicación detallada de por qué apostar (Lesiones, Clima, Racha).</span></li>
                            <li className="text-[10px] md:text-[11px] text-white flex gap-2 items-start"><span className="text-primary font-bold mt-0.5">✓</span> <span><strong>Experiencia Pro</strong>: Sin anuncios y máxima velocidad.</span></li>
                        </ul>

                        <div className="mt-auto border-t border-primary/20 pt-4">
                            <MethodSelector selected={proMethod} onSelect={setProMethod} colorClass="border-primary text-primary" />

                            {proMethod === 'paypal' ? (
                                <div className="w-full mt-2 relative z-0">
                                    <PayPalScriptProvider options={{
                                        "client-id": "AS4GGvkBSJRI9m5_ueVBUPidgDAsifs7cknsS3CzzmF0V7b0JgXnPPQn5TEmnhHFfe9FR84GjBJZRMHG",
                                        vault: true,
                                        intent: "subscription"
                                    }}>
                                        <PayPalButtons
                                            style={{
                                                shape: 'rect',
                                                color: 'gold',
                                                layout: 'vertical',
                                                label: 'subscribe'
                                            }}
                                            createSubscription={(data, actions) => {
                                                return actions.subscription.create({
                                                    'plan_id': 'P-8VD112920G5791040NFZ2LHY' // Tu nuevo ID real
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                // Esto es lo que pasa cuando pagan con éxito
                                                console.log("Subscription ID:", data.subscriptionID);
                                                alert("¡Bienvenido a StatsEdge PRO! Tu pago fue procesado.");
                                                window.location.href = "/#/app"; // Redirigir a la app
                                            }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handlePurchase('pro', proMethod)}
                                    disabled={!!processing}
                                    className="w-full py-3 md:py-3.5 rounded bg-primary text-black font-black hover:bg-primary-dim transition-all shadow-glow hover:shadow-[0_0_20px_rgba(63,255,20,0.4)] text-xs tracking-wider border border-primary"
                                >
                                    {processing?.startsWith('pro') ? 'PROCESANDO...' : `ACTIVAR PRO (${getPrice('pro', proMethod).label})`}
                                </button>
                            )}
                            <div className="text-center mt-2 text-[9px] text-gray-500 font-mono">
                                Cancela cuando quieras. Acceso inmediato.
                            </div>
                        </div>
                    </div>

                    {/* OPTION 3: GOLDPICK (ORDER 3 - LAST) */}
                    <div className="min-w-[85vw] md:min-w-0 snap-center border border-[#FFD700]/30 bg-surface-dark/40 rounded-xl p-5 md:p-6 flex flex-col relative group hover:border-[#FFD700]/50 transition-all order-3 md:order-3 ring-1 ring-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.05)]">
                        <div className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-[#FFD700] text-black text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-lg whitespace-nowrap z-50 border-2 border-[#151a21]">
                            🔥 Más Vendido Hoy
                        </div>

                        <div className="mb-4 mt-4">
                            <h3 className="text-sm md:text-base font-bold text-[#FFD700] uppercase tracking-widest mb-1">Acceso Unitario</h3>
                            <div className="text-xl md:text-2xl font-bold text-white mb-1">GoldPick™</div>
                            <div className="text-xs md:text-sm font-mono text-text-muted">Desbloquea solo este partido</div>
                        </div>

                        {/* Urgency Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-[10px] text-gray-400 font-mono mb-1">
                                <span>Cupos Limitados</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[84%] shadow-[0_0_10px_rgba(255,69,0,0.5)]"></div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[180px] md:max-h-[220px] scrollbar-hide">
                            <ul className="space-y-3 mb-6">
                                <li className="text-[10px] md:text-[11px] text-gray-300 flex gap-2 items-start"><span className="text-[#FFD700] font-bold mt-0.5">✓</span> <span><strong>Algoritmo 88%+</strong>: Predicción con mayor índice de confianza del día.</span></li>
                                <li className="text-[10px] md:text-[11px] text-gray-300 flex gap-2 items-start"><span className="text-[#FFD700] font-bold mt-0.5">✓</span> <span><strong>Informe Confidencial IA</strong>: Explicación técnica "Sale o Sale".</span></li>
                                <li className="text-[10px] md:text-[11px] text-gray-300 flex gap-2 items-start"><span className="text-[#FFD700] font-bold mt-0.5">✓</span> <span><strong>Protección de Varianza</strong>: Seguro incluido. En caso de fallar, el pick del día siguiente lo tenés gratis.</span></li>
                                <li className="text-[10px] md:text-[11px] text-gray-300 flex gap-2 items-start"><span className="text-[#FFD700] font-bold mt-0.5">✓</span> <span><strong>Smart Money Tracking</strong>: Alineación Pro.</span></li>
                            </ul>
                        </div>

                        <div className="mt-auto border-t border-white/10 pt-4">
                            <MethodSelector selected={pickMethod} onSelect={setPickMethod} colorClass="border-[#FFD700] text-[#FFD700]" />
                            <button
                                onClick={() => handlePurchase('pick', pickMethod)}
                                disabled={!!processing}
                                className="w-full py-3 md:py-3.5 rounded bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-black transition-all text-xs tracking-wider shadow-glow hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                            >
                                {processing?.startsWith('pick') ? 'PROCESANDO...' : `DESBLOQUEAR AHORA (${getPrice('pick', pickMethod).label})`}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carousel Dots - Mobile Only */}
                <div className="md:hidden flex justify-center gap-2 mb-4 shrink-0">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${activeSlide === i ? 'w-6 bg-primary shadow-glow' : 'w-2 bg-white/20'}`}
                        />
                    ))}
                </div>

                <div className="mt-2 text-center shrink-0">
                    <p className="text-[10px] text-text-muted font-mono flex items-center justify-center gap-2 opacity-50">
                        <span className="material-symbols-outlined text-sm">lock</span> Pago Seguro SSL Encrypted • Cancelación inmediata en cualquier momento.
                    </p>
                </div>
            </div>
        </div>
    );
};
