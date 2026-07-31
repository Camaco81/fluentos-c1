import { useEffect, useRef, useState } from 'react'
import { MessagesSquare, Send, Sparkles } from 'lucide-react'
import { useApp } from '../hooks/useApp'

const FALLBACK_TOPIC =
  'Tema: ¿El trabajo remoto destruye la cultura corporativa o potencia la productividad?'

export default function DebatePrep() {
  const { callGemini, deck, showToast } = useApp()
  const [topic, setTopic] = useState('Selecciona "Generar Tema"')
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [input, setInput] = useState('')
  const [targetWords, setTargetWords] = useState([])
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '👋 FluentOS Bot: Haz clic en "Generar Tema" para iniciar una conversación de práctica C1. Te daré opiniones para que las debatas.',
    },
  ])
  const chatRef = useRef(null)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight })
  }, [messages])

  const generateTopic = async () => {
    setGenerating(true)
    setTargetWords(deck.slice(0, 3).map((card) => card.word))
    try {
      const response = await callGemini({
        prompt:
          'Generate a compelling C1/C2 English discussion topic about technology, ethics, or modern work. Provide 1 sentence title and 1 opening question to start a debate.',
      })
      setTopic(response)
    } catch {
      setTopic(FALLBACK_TOPIC)
    } finally {
      setGenerating(false)
    }
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setSending(true)
    try {
      const reply = await callGemini({
        prompt: `Act as an English C1 conversation partner on Episoden. Reply concisely (max 2 sentences) to the user's argument, challenging them intellectually: "${text}"`,
      })
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    } catch (err) {
      console.error(err)
      showToast(
        err.message === 'NO_API_KEY'
          ? 'Configura tu Gemini API Key en la barra superior.'
          : 'Error al responder el chat.',
        'error',
      )
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-xl">
          <h2 className="flex items-center gap-2 text-lg font-bold text-white">
            <MessagesSquare className="h-5 w-5 text-emerald-400" /> Preparación Episoden
          </h2>
          <p className="text-xs text-slate-400">
            Genera temas de conversación avanzada para tus sesiones de 8:15 AM.
          </p>
          <button
            type="button"
            onClick={generateTopic}
            disabled={generating}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/10 transition hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60"
          >
            {generating ? 'Generando tema C1 con Gemini...' : '🎲 Generar Tema de Debate C1'}
          </button>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Reto de Palabras Objetivo
          </h3>
          <p className="text-xs text-slate-400">
            Usa estas palabras de tu mazo durante tu próxima sesión:
          </p>
          <div className="flex flex-wrap gap-2">
            {targetWords.length > 0 ? (
              targetWords.map((word) => (
                <span
                  key={word}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300"
                >
                  {word}
                </span>
              ))
            ) : (
              <span className="rounded-lg border border-slate-600 bg-slate-700 px-2.5 py-1 text-xs text-emerald-300">
                Ninguna palabra aún
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[500px] flex-col rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-xl lg:col-span-2">
        <div className="mb-4 flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100">{topic}</h3>
            <p className="text-[11px] text-slate-400">
              Practica tus argumentos con la IA antes de conectarte a Episoden
            </p>
          </div>
        </div>

        <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto pr-2 text-xs">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={
                message.role === 'user'
                  ? 'ml-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-200'
                  : 'mr-6 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-slate-300'
              }
            >
              <b>{message.role === 'user' ? 'Tú:' : 'FluentOS AI Partner:'}</b> {message.text}
            </div>
          ))}
          {sending && (
            <div className="mr-6 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-slate-400">
              <Sparkles className="mr-1 inline h-3 w-3 animate-pulse text-emerald-400" />
              Escribiendo...
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 border-t border-slate-700/60 pt-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage()
            }}
            placeholder="Escribe tu argumento en inglés..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={sending}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-600 disabled:opacity-60"
          >
            <Send className="h-3.5 w-3.5" /> Enviar
          </button>
        </div>
      </div>
    </div>
  )
}
