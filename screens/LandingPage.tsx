import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../types';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
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
            <header className="fixed top-0 w-full z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(63,255,20,0.3)]">
                            <span className="material-symbols-outlined text-black text-lg">equalizer</span>
                        </div>
                        <h1 className="text-xl font-black tracking-tighter text-white">STATS<span className="text-primary">EDGE</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(Screen.Auth)} className="text-sm font-bold text-gray-300 hover:text-white transition-colors hidden md:block">
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => navigate(Screen.Auth)}
                            className="bg-primary hover:bg-primary-dim text-black font-bold py-2 px-5 rounded-lg text-sm transition-all shadow-glow"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-[#0F172A] to-[#0F172A] pointer-events-none"></div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block mb-4 px-3 py-1 rounded-full bg-surface-dark border border-surface-border">
                        <span className="text-primary text-xs font-mono font-bold tracking-widest uppercase">Inteligencia Artificial V.4.2 Activa</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Detecta valor real,<br />no intuición.
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                        Deja de apostar a ciegas. Nuestros algoritmos procesan más de <span className="text-white font-bold">10,000 puntos de datos</span> por partido para encontrar el desajuste de precios (Edge) que las casas de apuestas no quieren que veas.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate(Screen.ValueBetPro)}
                            className="w-full md:w-auto bg-primary hover:bg-primary-dim text-black font-bold py-4 px-8 rounded-xl text-lg transition-all shadow-[0_0_30px_rgba(63,255,20,0.4)] hover:shadow-[0_0_50px_rgba(63,255,20,0.6)] flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">rocket_launch</span>
                            Empezar Ahora - Gratis
                        </button>
                        <button className="w-full md:w-auto bg-surface-dark border border-surface-border text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">play_circle</span>
                            Ver Demo
                        </button>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Fake Partners / Trust Signals */}
                        <span className="text-xl font-black text-white/40">SPORTMONKS</span>
                        <span className="text-xl font-black text-white/40">GEMINI AI</span>
                        <span className="text-xl font-black text-white/40">VITE</span>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-20 bg-[#0B1015] border-y border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 hover:border-primary/30 transition-all group">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-primary text-2xl">query_stats</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Resultados Avanzados</h3>
                            <p className="text-text-muted leading-relaxed">
                                No solo te decimos quién gana. Analizamos xG (Goles Esperados), presión ofensiva y métricas avanzadas para predecir el flujo del partido.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 hover:border-primary/30 transition-all group">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-blue-400 text-2xl">groups</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Intel de Planteles</h3>
                            <p className="text-text-muted leading-relaxed">
                                Rastreamos lesiones, suspensiones y noticias de último minuto que impactan drásticamente las probabilidades reales de un evento.
                            </p>
                        </div>
                        <div className="p-8 rounded-2xl bg-[#0F172A] border border-white/5 hover:border-primary/30 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-purple-400 text-2xl">smart_toy</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Razonamiento IA</h3>
                            <p className="text-text-muted leading-relaxed">
                                Nuestra IA generativa explica el "por qué" de cada selección con un informe detallado, para que entiendas la lógica detrás del valor.
                            </p>
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
                                <li><a href="#" className="hover:text-primary transition-colors">App iOS</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">App Android</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Precios</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Recursos</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Guía de apuestas</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Glosario</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Calculadora Kelly</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Empresa</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><a href="#" className="hover:text-primary transition-colors">Sobre Nosotros</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Carreras</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Contacto</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Afiliados</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-text-muted">
                                <li><a href="#" className="hover:text-primary transition-colors">Términos de Servicio</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Política de Privacidad</a></li>
                                <li><a href="#" className="hover:text-primary transition-colors">Juego Responsable</a></li>
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
