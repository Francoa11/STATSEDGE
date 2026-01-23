import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Screen } from '../types';
import { supabase } from '../services/supabaseClient';

export const Dock: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate(Screen.Auth);
    };

    const screens = [
        { id: Screen.ValueBetPro, icon: 'terminal', label: 'Terminal' },
        { id: Screen.GoldPick, icon: 'stars', label: 'Gold Pick' }, // Keep separate for specific highlight
    ];

    return (
        <aside className="w-full md:w-20 h-16 md:h-full bg-[#0F1216] border-t md:border-t-0 md:border-r border-border-dark flex flex-row md:flex-col items-center justify-between md:justify-start px-4 md:px-0 py-2 md:py-6 flex-shrink-0 z-50">
            <div className="hidden md:block mb-8 group relative cursor-pointer" onClick={() => !user && navigate(Screen.Auth)}>
                {/* Logo or Auth Trigger (Desktop Only) */}
                <div className="w-10 h-10 bg-primary/20 text-primary border border-primary rounded flex items-center justify-center font-black text-xs shadow-[0_0_15px_rgba(63,255,20,0.2)] group-hover:scale-105 transition-transform overflow-hidden">
                    {user ? (
                        user.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm">{user.email?.slice(0, 2).toUpperCase()}</span>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center leading-none">
                            <span className="text-[10px]">SE</span>
                            <span className="text-[6px] opacity-70">EDGE</span>
                        </div>
                    )}
                </div>
                {!user && <div className="absolute left-14 top-2 bg-surface-light border border-border-dark text-xs px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Iniciar Sesión</div>}
            </div>

            <nav className="flex flex-row md:flex-col gap-1 md:gap-6 w-full justify-around md:justify-start px-0 md:px-2">
                {screens.map((s) => {
                    const isActive = location.pathname === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => navigate(s.id)}
                            className={`group relative flex flex-col items-center justify-center transition-all duration-300 ease-out ${isActive
                                ? 'w-10 h-10 md:w-14 md:h-14 -translate-y-1 md:-translate-y-2 bg-primary text-black shadow-[0_0_20px_rgba(63,255,20,0.3)]'
                                : 'w-10 h-10 md:w-12 md:h-12 text-text-muted hover:bg-surface-dark hover:text-white hover:scale-110 hover:-translate-y-1'
                                } rounded-lg md:rounded-xl`}
                        >
                            <span className="material-symbols-outlined text-[20px] md:text-[26px]">{s.icon}</span>

                            {/* Label Tooltip (Desktop) */}
                            <span className="hidden md:block absolute left-14 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-white/10 font-mono whitespace-nowrap pointer-events-none z-50">
                                {s.label}
                            </span>

                            {/* Active Indicator */}
                            {isActive && (
                                <span className="absolute -bottom-1 md:-bottom-2 w-1 h-1 bg-primary rounded-full shadow-glow"></span>
                            )}
                        </button>
                    )
                })}
            </nav>
            <div className="hidden md:flex mt-auto flex-col items-center gap-4">
                {user ? (
                    <button onClick={handleLogout} className="w-10 h-10 rounded hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-danger group relative">
                        <span className="material-symbols-outlined">logout</span>
                        <div className="absolute left-14 bg-surface-light border border-border-dark text-xs px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Cerrar Sesión</div>
                    </button>
                ) : (
                    <button onClick={() => navigate(Screen.Auth)} className="w-10 h-10 rounded hover:bg-white/5 flex items-center justify-center text-text-muted hover:text-primary group relative">
                        <span className="material-symbols-outlined">login</span>
                        <div className="absolute left-14 bg-surface-light border border-border-dark text-xs px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Entrar</div>
                    </button>
                )}

                <div className="text-[8px] text-text-muted rotate-180 transform" style={{ writingMode: 'vertical-lr' }}>
                    Navegación Prototipo v1.0
                </div>
            </div>
        </aside>
    );
};