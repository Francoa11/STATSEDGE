import React, { useState } from 'react';

const PaymentModal = () => {
    const [step, setStep] = useState('selection'); // 'selection' o 'upload'

    if (step === 'upload') {
        return (
            <div className="bg-[#0a0f18] p-6 rounded-2xl border border-gray-800 max-w-md mx-auto">
                <button onClick={() => setStep('selection')} className="text-gray-500 text-xs mb-4 hover:text-white">← Volver</button>
                <h2 className="text-white text-lg font-bold mb-2">Subir Comprobante</h2>
                <p className="text-gray-400 text-sm mb-6">Ingresá tu mail y subí la captura para que activemos tu cuenta PRO.</p>

                <form className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Tu email de registro"
                        className="bg-gray-900 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                    <div className="border-2 border-dashed border-gray-700 p-8 rounded-xl text-center hover:border-gray-500 transition cursor-pointer">
                        <p className="text-gray-500 text-sm">Seleccionar imagen o PDF</p>
                        <input type="file" className="hidden" id="fileUpload" />
                        <label htmlFor="fileUpload" className="cursor-pointer text-blue-400 text-xs mt-2 block">Buscar archivo</label>
                    </div>
                    <button className="bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-500 transition">
                        Enviar para Verificación
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0f18] p-6 rounded-2xl border border-gray-800 max-w-md mx-auto">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 text-center">Opciones de Pago</h2>

            <div className="flex flex-col gap-4">
                {/* Botones de Pago (Mantenemos los colores que te gustaron) */}
                <button className="flex items-center gap-4 bg-[#5eb1f3] text-black p-4 rounded-xl font-bold">
                    <span>🇦🇷</span> MERCADO PAGO
                </button>
                <button className="flex items-center gap-4 bg-[#2ecc71] text-black p-4 rounded-xl font-bold">
                    <span>🌎</span> TAKENOS / USD
                </button>
                <button className="flex items-center gap-4 bg-[#f1c40f] text-black p-4 rounded-xl font-bold">
                    <span>₿</span> CRIPTO (USDT)
                </button>

                <div className="border-t border-gray-800 my-4"></div>

                {/* BOTÓN YA PAGUÉ (No abre WhatsApp, cambia el Modal) */}
                <button
                    onClick={() => setStep('upload')}
                    className="flex flex-col items-center justify-center border-2 border-gray-700 p-4 rounded-xl hover:bg-gray-900 transition group"
                >
                    <p className="text-white font-bold text-sm">YA HE PAGADO</p>
                    <p className="text-gray-500 text-xs group-hover:text-gray-300 transition">Subir comprobante de pago</p>
                </button>
            </div>
        </div>
    );
};

export default PaymentModal;
