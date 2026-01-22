import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../types';

const InfoLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-y-auto">
            {/* Nav */}
            <nav className="border-b border-white/5 bg-[#0F1216]">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(Screen.Landing)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
                            <span className="material-symbols-outlined text-black text-xs font-bold">arrow_back</span>
                        </div>
                        <span className="font-bold tracking-tight">VOLVER</span>
                    </button>
                    <div className="text-sm font-mono text-text-muted uppercase">{title}</div>
                </div>
            </nav>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-6 py-12">
                <div className="prose prose-invert prose-lg max-w-none">
                    <h1 className="text-4xl font-black mb-8 text-white uppercase tracking-tight">{title}</h1>
                    {children}
                </div>
            </main>

            {/* Footer Simple */}
            <footer className="border-t border-white/5 py-8 mt-12 text-center text-xs text-text-muted">
                © 2024 StatsEdge Inc.
            </footer>
        </div>
    );
};

export const AboutPage: React.FC = () => (
    <InfoLayout title="Sobre Nosotros">
        <p className="lead text-xl text-gray-300">
            StatsEdge nació de una frustración simple: <strong>La casa siempre gana porque tiene mejores datos que tú.</strong> Decidimos cambiar eso.
        </p>
        <hr className="border-white/10 my-8" />
        <h3>Nuestra Misión</h3>
        <p>
            Democratizar el acceso a herramientas de análisis deportivo de nivel institucional (Hedge Fund grade). Creemos que con la combinación correcta de Inteligencia Artificial, Big Data y modelos matemáticos (Poisson, Monte Carlo), el apostador promedio puede convertirse en un inversor informado.
        </p>
        <h3>La Tecnología "War Room"</h3>
        <p>
            No somos tipsters. Somos ingenieros de datos. Nuestra terminal procesa más de 10,000 eventos diarios, cruzando cuotas de 40 casas de apuestas con datos de rendimiento en tiempo real (xG, posesión, lesiones).
        </p>
        <p>
            El resultado no es una "corazonada", es una <strong>Ventaja Matemática (Edge)</strong> cuantificable.
        </p>
    </InfoLayout>
);

export const CareersPage: React.FC = () => (
    <InfoLayout title="Carreras">
        <p className="lead text-xl text-gray-300">
            Buscamos mentes brillantes obsesionadas con los números y el deporte.
        </p>
        <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-lg my-8">
            <h4 className="text-blue-400 font-bold m-0 uppercase text-sm">Open Position</h4>
            <h2 className="text-2xl font-bold text-white mt-2 mb-4">Senior Data Scientist (Python/ML)</h2>
            <p className="text-sm mb-4">
                Lidera el desarrollo de nuestros modelos predictivos de fútbol. Experiencia con PyTorch, Scikit-learn y APIs de deportes requerida.
            </p>
            <button className="bg-white text-black px-4 py-2 font-bold text-sm rounded hover:bg-gray-200">Aplicar Ahora (Remote)</button>
        </div>
        <div className="bg-surface-dark border border-white/10 p-6 rounded-lg my-4 opacity-75">
            <h4 className="text-gray-500 font-bold m-0 uppercase text-sm">Closed</h4>
            <h2 className="text-2xl font-bold text-gray-400 mt-2 mb-4">Frontend Engineer (React/Three.js)</h2>
        </div>
        <p className="mt-8 text-sm text-gray-400">
            ¿No ves tu rol? Envíanos tu CV y GitHub a <strong className="text-white">jobs@statsedge.io</strong>.
        </p>
    </InfoLayout>
);

export const ContactPage: React.FC = () => (
    <InfoLayout title="Contacto">
        <p>
            ¿Tienes dudas sobre tu suscripción o necesitas soporte técnico con la terminal? Estamos aquí 24/7.
        </p>
        <div className="grid gap-6 mt-8">
            <div className="bg-surface-dark p-6 rounded border border-white/5">
                <span className="material-symbols-outlined text-3xl text-primary mb-4">support_agent</span>
                <h3 className="text-xl font-bold text-white">Soporte al Cliente</h3>
                <p className="text-gray-400 mb-4">Tiempo de respuesta promedio: &lt; 2 horas.</p>
                <a href="mailto:support@statsedge.io" className="text-primary font-bold hover:underline">support@statsedge.io</a>
            </div>
            <div className="bg-surface-dark p-6 rounded border border-white/5">
                <span className="material-symbols-outlined text-3xl text-blue-400 mb-4">business_center</span>
                <h3 className="text-xl font-bold text-white">Ventas / Media</h3>
                <p className="text-gray-400 mb-4">Para prensa o acuerdos comerciales.</p>
                <a href="mailto:business@statsedge.io" className="text-blue-400 font-bold hover:underline">business@statsedge.io</a>
            </div>
        </div>
    </InfoLayout>
);

export const AffiliatesPage: React.FC = () => (
    <InfoLayout title="Afiliados">
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-8 rounded-xl border border-primary/20 mb-8 text-center">
            <h2 className="text-3xl font-black text-white mb-2">Gana 30% Recurrente</h2>
            <p className="text-lg text-gray-300">Únete al programa de afiliados de herramientas deportivas #1 en Latam.</p>
            <button className="mt-6 bg-primary text-black font-bold px-8 py-3 rounded hover:scale-105 transition-transform">
                Convertirse en Partner
            </button>
        </div>
        <h3>¿Por qué promocionar StatsEdge?</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li><strong>Conversión Alta:</strong> Landing pages optimizadas y prueba social fuerte.</li>
            <li><strong>Pagos Mensuales:</strong> Recibe tus comisiones en USDT, Bitcoin o Transferencia (Wise).</li>
            <li><strong>LTV Alto:</strong> Nuestros usuarios permanecen un promedio de 8 meses gracias a los resultados.</li>
        </ul>
    </InfoLayout>
);

export const TermsPage: React.FC = () => (
    <InfoLayout title="Términos de Servicio">
        <div className="text-sm text-gray-400 space-y-6">
            <p><strong>Última actualización: Enero 2026</strong></p>
            <p>
                Bienvenido a StatsEdge. Al acceder a nuestra plataforma, aceptas estos términos. StatsEdge es una herramienta de análisis de datos, no un sitio de apuestas.
            </p>
            <h4>1. Uso del Servicio</h4>
            <p>
                Usted acepta utilizar StatsEdge solo para fines legales y de entretenimiento personal. Está prohibido revender los datos o compartir su cuenta (Multi-login detectado automáticamente).
            </p>
            <h4>2. Descargo de Responsabilidad (Disclaimer)</h4>
            <p>
                Las predicciones, análisis y "Gold Picks" son generados por modelos de IA basados en datos históricos. <strong>No garantizamos ganancias futuras.</strong> Las apuestas deportivas implican riesgo de pérdida de capital.
            </p>
            <h4>3. Pagos y Reembolsos</h4>
            <p>
                Las suscripciones se cobran por adelantado. Las políticas de reembolso varían según el plan (ej. Protección de Varianza otorga crédito, no devolución de efectivo).
            </p>
        </div>
    </InfoLayout>
);

export const PrivacyPage: React.FC = () => (
    <InfoLayout title="Política de Privacidad">
        <div className="text-sm text-gray-400 space-y-6">
            <p>
                En StatsEdge, la privacidad de tus datos es sagrada. No vendemos tu información a casas de apuestas ni terceros.
            </p>
            <h4>Datos que recolectamos</h4>
            <ul className="list-disc pl-5">
                <li>Email y datos de perfil para gestión de cuenta.</li>
                <li>Datos de uso para mejorar nuestros algoritmos de recomendación.</li>
            </ul>
            <h4>Uso de Cookies</h4>
            <p>
                Utilizamos cookies esenciales para mantener tu sesión segura. No utilizamos trackers invasivos de publicidad.
            </p>
            <h4>Seguridad</h4>
            <p>
                Toda la comunicación está encriptada vía SSL (TLS 1.3). Tus pagos son procesados por proveedores seguros (Stripe, MercadoPago, Crypto), no almacenamos detalles de tarjetas.
            </p>
        </div>
    </InfoLayout>
);

export const ResponsibleGamingPage: React.FC = () => (
    <InfoLayout title="Juego Responsable">
        <div className="borderl-4 border-yellow-500 bg-yellow-500/10 p-6 rounded mb-8">
            <h3 className="text-yellow-500 font-bold m-0 text-lg uppercase">Importante</h3>
            <p className="text-white mt-2">
                Las apuestas deportivas deben ser vistas como entretenimiento, no como una forma de ganar dinero rápido para pagar deudas.
            </p>
        </div>
        <h3>Reglas de Oro</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Nunca apuestes dinero que necesites para vivir (alquiler, comida).</li>
            <li>Establece límites de depósito y tiempo antes de empezar.</li>
            <li>No persigas las pérdidas (Chasing losses).</li>
            <li>Si sientes ansiedad o estrés por apostar, DETENTE.</li>
        </ul>
        <h3 className="mt-8">Ayuda Profesional</h3>
        <p>
            Si sientes que tienes un problema, busca ayuda inmediata:
        </p>
        <ul className="space-y-2 mt-4">
            <li><a href="#" className="text-primary hover:underline">Gamblers Anonymous (Global)</a></li>
            <li><a href="#" className="text-primary hover:underline">Jugadores Anónimos (España/Latam)</a></li>
        </ul>
    </InfoLayout>
);
