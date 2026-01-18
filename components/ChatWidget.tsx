import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Sistemas en línea. QuantBot listo. ¿En qué puedo ayudarte con tu análisis?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // INTERCEPT LOGIC: Check if user wants analysis
      if (input.toLowerCase().includes('arsenal') || input.toLowerCase().includes('bet') || input.toLowerCase().includes('apostar')) {
        // DEMO: Call backend for a specific match scenario
        // In a real app, NLP would extract entities. Here we act as if it's Arsenal vs Liverpool.
        const analysis = await import('../services/BetService').then(m => m.BetService.analyzeBet({
          user_id: 'demo-user-uuid', // Placeholder
          match_id: 'ars-liv-202X',
          market: '1X2',
          selection: 'Arsenal',
          odds: 2.45,
          p_model: 0.42, // Model thinks 42% chance
          stake: 100
        }));

        const responseText = `
**Análisis de Partido: Arsenal vs Liverpool**

*   **Edge:** ${(analysis.edge_percent * 100).toFixed(1)}%
*   **Stake Kelly:** $${analysis.kelly_stake.toFixed(2)}
*   **Recomendación:** ${analysis.recommendation}

${analysis.is_elite_alert ? '🔥 **ALERTA ELITE**: Valor Significativo Detectado!' : ''}
          `;

        setMessages(prev => [...prev, { role: 'model', text: responseText.trim() }]);
        setLoading(false);
        return;
      }

      // Prepare history for standard API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await sendChatMessage(history, input);
      setMessages(prev => [...prev, { role: 'model', text: responseText || "Sin respuesta." }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'model', text: "Error conectando con red neuronal o servicio backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {/* Trigger Button - Moved to Left on Mobile to separate from action buttons */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 left-4 md:bottom-20 md:left-auto md:right-6 z-[60] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary hover:bg-primary-dim text-black shadow-[0_0_20px_rgba(63,255,20,0.4)] transition-all transform hover:scale-105"
      >
        <span className="material-symbols-outlined text-2xl md:text-3xl">smart_toy</span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-36 right-6 z-50 w-80 md:w-96 h-[500px] bg-[#121810] border border-surface-border rounded-lg flex flex-col shadow-2xl overflow-hidden font-display">
          {/* Header */}
          <div className="bg-[#182016] p-4 border-b border-surface-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <h3 className="text-white font-bold text-sm tracking-wide">QUANTBOT AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-white">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0d120c]">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm font-mono leading-relaxed ${msg.role === 'user'
                    ? 'bg-primary/20 text-white border border-primary/30'
                    : 'bg-[#1a232e] text-text-muted border border-border-dark'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1a232e] p-3 rounded-lg border border-border-dark flex gap-1">
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-[#182016] border-t border-surface-border flex gap-2">
            <input
              className="flex-1 bg-[#0d120c] border border-surface-border rounded px-3 py-2 text-white text-sm focus:border-primary focus:ring-0 placeholder:text-text-muted/50 font-mono"
              placeholder="Consultar red neuronal..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="px-3 rounded bg-primary text-black disabled:opacity-50 hover:bg-primary-dim transition-colors"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
