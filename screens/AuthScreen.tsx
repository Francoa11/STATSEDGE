import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export const AuthScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });
                if (error) throw error;

                // Create profile manually if trigger doesn't exist (failsafe)
                if (data.user) {
                    await supabase.from('profiles').insert([
                        {
                            id: data.user.id,
                            email: email,
                            full_name: fullName,
                            subscription_status: 'free'
                        }
                    ]);
                }
                navigate('/');
            }
        } catch (err: any) {
            let msg = err.message;
            if (msg.includes('Invalid login credentials')) msg = 'Usuario o contraseña incorrectos.';
            else if (msg.includes('User already registered')) msg = 'Este email ya está registrado.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
        if (error) setError(error.message);
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0F172A] relative overflow-hidden font-display">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md bg-[#151a21] border border-border-dark p-8 rounded-xl shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">STATS<span className="text-primary">EDGE</span></h1>
                    <p className="text-text-muted text-sm uppercase tracking-widest leading-loose">
                        Estadísticas Avanzadas de Deportes
                    </p>
                    <p className="text-xs text-text-muted/50 mt-4">
                        {isLogin ? 'Bienvenido a STATSEDGE. La inteligencia de datos a tu servicio.' : 'Crea tu cuenta y accede al Edge.'}
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-danger/10 border border-danger/30 rounded text-danger text-xs text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    {!isLogin && (
                        <div>
                            <label className="text-xs text-text-muted uppercase mb-1 block">Nombre Completo</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-[#0F1216] border border-border-dark rounded p-3 text-white focus:border-primary focus:outline-none transition-colors"
                                placeholder="Ej. Juan Pérez"
                                required
                            />
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-text-muted uppercase mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#0F1216] border border-border-dark rounded p-3 text-white focus:border-primary focus:outline-none transition-colors"
                            placeholder="nombre@ejemplo.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-text-muted uppercase mb-1 block">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#0F1216] border border-border-dark rounded p-3 text-white focus:border-primary focus:outline-none transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-primary text-black font-bold py-3 rounded hover:bg-primary-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Procesando...' : (isLogin ? 'Ingresar' : 'Registrarse')}
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-[1px] bg-border-dark flex-1"></div>
                    <span className="text-text-muted text-xs uppercase">O continúa con</span>
                    <div className="h-[1px] bg-border-dark flex-1"></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-surface-dark border border-border-dark hover:bg-white/5 text-white font-medium py-3 rounded transition-colors flex items-center justify-center gap-2"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Google
                </button>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-xs text-text-muted hover:text-white underline"
                    >
                        {isLogin ? '¿No tienes cuenta? Regístrate gratis' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={() => navigate('/')}
                            className="text-[10px] text-primary/50 hover:text-primary uppercase"
                        >
                            Volver al Demo (Invitado)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
