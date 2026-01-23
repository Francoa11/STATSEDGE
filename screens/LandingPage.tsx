import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../types';
import { supabase } from '../services/supabaseClient';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to App if logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                navigate(Screen.ValueBetPro);
            }
        });
    }, [navigate]);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            q: "¿Qué es STATSEDGE?",
            a: "STATSEDGE es una terminal de inteligencia artificial que escanea más de 3,000 mercados deportivos diarios en tiempo real. Utilizamos modelos predictivos avanzados para detectar ineficiencias en las cuotas (Edge) y ofrecerte las mejores oportunidades de valor."
        },
        {
            q: "¿Cuánto cuesta la suscripción?",
            a: "Ofrecemos un plan mensual PRO por $19.99 USD (o equivalente en moneda local) que te da acceso ilimitado a todas las predicciones y herramientas. También puedes comprar picks individuales (GoldPick) por $14.99 USD."
        },
        {
            q: "¿Puedo cancelar en cualquier momento?",
            a: "Sí, la suscripción es 100% flexible. Puedes cancelar en cualquier momento desde tu panel de usuario sin cargos ocultos ni penalizaciones."
        },
        {
            q: "¿Qué deportes cubren?",
            a: "Actualmente cubrimos las principales ligas de Fútbol (Europa y Latam), NBA, y Tenis (ATP/WTA). Estamos constantemente agregando nuevos mercados y deportes a nuestro algoritmo."
        }
    ];

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-y-auto w-full">
            {/* Header */}
            {/* Header - Mobile-First */}
            <header className="fixed top-0 w-full z-50 bg-background-dark/95 backdrop-blur-md border-b border-surface-border">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-primary rounded-sm flex items-center justify-center shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                            <span className="material-symbols-outlined text-black text-sm md:text-base font-bold">query_stats</span>
                        </div>
                        <h1 className="text-base md:text-lg font-black tracking-tighter text-white leading-none">STATS<span className="text-primary">EDGE</span></h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(Screen.Auth)} className="text-[10px] md:text-sm font-bold text-gray-400 hover:text-white transition-colors">
                            LOGIN
                        </button>
                        <button
                            onClick={() => navigate(Screen.Auth)}
                            className="bg-primary hover:bg-white text-black font-bold py-1.5 px-3 md:py-2 md:px-5 rounded-sm text-[10px] md:text-xs uppercase tracking-wide transition-all shadow-glow-sm"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 md:px-6 relative overflow-hidden bg-background-dark">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background-dark to-background-dark pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 px-3 py-1 rounded-sm bg-surface-dark border border-surface-border">
                        <span className="text-primary text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase">Sistema V.4.2 Online</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
                        Datos <span className="text-primary">Reales.</span><br />
                        <span className="text-gray-700 line-through decoration-red-500/50 decoration-4">No Intuición.</span>
                    </h1>
                    <p className="text-sm md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        El 99% pierde por apostar con el corazón. <strong className="text-white">StatsEdge</strong> analiza <span className="text-primary font-bold">+10,000 variables</span> por segundo para que apuestes con el cerebro.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate(Screen.Auth)}
                            className="w-full md:w-auto bg-primary hover:bg-white text-black font-bold py-3 md:py-4 px-8 rounded-sm text-sm md:text-lg transition-all shadow-glow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
                        >
                            <span className="material-symbols-outlined">terminal</span>
                            Iniciar Terminal
                        </button>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20 bg-surface-dark border-y border-surface-border">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-6 md:p-8 rounded-sm bg-background-dark border border-surface-border hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                                <span className="material-symbols-outlined text-6xl text-primary">query_stats</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Análisis Cuantitativo</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Calculamos xG (Goles Esperados), distribución de Poisson y liquidez del mercado para generar una probabilidad real para cada evento.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-6 md:p-8 rounded-sm bg-background-dark border border-surface-border hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                                <span className="material-symbols-outlined text-6xl text-blue-400">psychology</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Razonamiento IA</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Nuestro Agente de IA lee miles de reportes de lesiones y fuentes de noticias para explicar el "POR QUÉ" detrás de cada ventaja estadística.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-6 md:p-8 rounded-sm bg-background-dark border border-surface-border hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                                <span className="material-symbols-outlined text-6xl text-purple-400">lock</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Protección de Mercado</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                Los picks de alto valor se bloquean para un número limitado de usuarios Pro para prevenir la corrección del mercado y el desplome de cuotas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cómo Funciona */}
            <section className="py-20 px-6 bg-background-dark relative">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-white uppercase tracking-tight">Cómo Funciona</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-[#0F1216] border sm:border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,227,138,0.2)]">
                                <span className="text-2xl font-black text-primary">1</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Escaneo Global</h3>
                            <p className="text-sm text-text-muted">Nuestros bots rastrean cuotas en 40+ casas de apuestas en tiempo real buscando discrepancias.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-[#0F1216] border sm:border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,227,138,0.2)]">
                                <span className="text-2xl font-black text-primary">2</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Validación IA</h3>
                            <p className="text-sm text-text-muted">El motor de IA cruza los datos con noticias de última hora, clima y alineaciones probables.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-[#0F1216] border sm:border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,227,138,0.2)]">
                                <span className="text-2xl font-black text-primary">3</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Ejecución Pro</h3>
                            <p className="text-sm text-text-muted">Recibes la alerta "EDGE" con el análisis exacto y el stake recomendado (Kelly Criterion).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonios */}
            <section className="py-20 px-6 bg-surface-dark border-t border-surface-border">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-12 text-white uppercase tracking-tight">Lo que dicen los Pros</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Review 1 */}
                        <div className="bg-background-dark p-6 rounded border border-white/5">
                            <div className="flex items-center gap-1 text-warning mb-4">
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-6 italic">"Llevo 5 años en apuestas deportivas y nunca había visto una herramienta que combine xG con noticias de esta manera. El Gold Pick de ayer fue increíble."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">JD</div>
                                <div>
                                    <div className="text-sm font-bold text-white">Javier Duarte</div>
                                    <div className="text-xs text-text-muted">Analista Deportivo</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-background-dark p-6 rounded border border-white/5">
                            <div className="flex items-center gap-1 text-warning mb-4">
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-6 italic">"La función de Protección de Varianza me da mucha paz mental. Saber que si fallo tengo el crédito de vuelta es un game changer total."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">MR</div>
                                <div>
                                    <div className="text-sm font-bold text-white">Martín Rodriguez</div>
                                    <div className="text-xs text-text-muted">Trader Profesional</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-background-dark p-6 rounded border border-white/5">
                            <div className="flex items-center gap-1 text-warning mb-4">
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                                <span className="material-symbols-outlined text-sm">star</span>
                            </div>
                            <p className="text-sm text-gray-300 mb-6 italic">"La interfaz es rapidísima y va al grano. Nada de publicidad molesta ni banners, solo datos puros y duros. Vale cada centavo."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">AL</div>
                                <div>
                                    <div className="text-sm font-bold text-white">Alex López</div>
                                    <div className="text-xs text-text-muted">Miembro Pro</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-center mb-12">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border border-white/10 rounded-xl bg-surface-dark overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-bold text-lg">{faq.q}</span>
                                    <span className={`material-symbols-outlined transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                                    <p className="text-text-muted leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Professional */}
            <footer className="bg-[#0B1015] border-t border-white/5 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
                        <div>
                            <h4 className="font-bold text-white mb-6">Producto</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><a href="#" className="hover:text-primary transition-colors">Terminal Web</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Precios</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Recursos</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Guía de apuestas</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Glosario</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Empresa</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><button onClick={() => navigate(Screen.About)} className="hover:text-primary transition-colors text-left">Sobre Nosotros</button></li>
                                <li><button onClick={() => navigate(Screen.Careers)} className="hover:text-primary transition-colors text-left">Carreras</button></li>
                                <li><button onClick={() => navigate(Screen.Contact)} className="hover:text-primary transition-colors text-left">Contacto</button></li>
                                <li><button onClick={() => navigate(Screen.Affiliates)} className="hover:text-primary transition-colors text-left">Afiliados</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><button onClick={() => navigate(Screen.Terms)} className="hover:text-primary transition-colors text-left">Términos de Servicio</button></li>
                                <li><button onClick={() => navigate(Screen.Privacy)} className="hover:text-primary transition-colors text-left">Política de Privacidad</button></li>
                                <li><button onClick={() => navigate(Screen.Responsible)} className="hover:text-primary transition-colors text-left">Juego Responsable</button></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                                <span className="material-symbols-outlined text-black text-xs">equalizer</span>
                            </div>
                            <span className="text-sm font-bold text-white">STATS<span className="text-primary">EDGE</span></span>
                        </div>
                        <p className="text-xs text-text-muted text-center md:text-right">
                            © 2024 StatsEdge Inc. Todos los derechos reservados.<br />
                            StatsEdge no es una casa de apuestas. La información es solo para fines informativos.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
