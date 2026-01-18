import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title = "¡Acceso Desbloqueado!", message = "Tu terminal ha sido actualizada. Ya tienes acceso a la ventaja matemática." }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-[#0F1216] border border-primary/50 rounded-2xl w-full max-w-sm p-8 flex flex-col items-center text-center relative shadow-[0_0_50px_rgba(63,255,20,0.3)]">

                {/* Visual Icon */}
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
                </div>

                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-2">
                    {title}
                </h2>

                <p className="text-text-muted text-sm leading-relaxed mb-8">
                    {message}
                </p>

                <button
                    onClick={onClose}
                    className="w-full py-4 bg-primary text-black font-black uppercase tracking-wider rounded-xl hover:bg-primary-dim transition-all shadow-glow hover:scale-[1.02]"
                >
                    Ver Análisis Ahora
                </button>

                {/* Confetti / Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl">
                    <div className="absolute top-[-10%] left-[-10%] w-20 h-20 bg-primary/30 blur-2xl rounded-full"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-20 h-20 bg-blue-500/30 blur-2xl rounded-full"></div>
                </div>
            </div>
        </div>
    );
};
