import { useEffect, useRef, useState } from 'react'
import { Mic, Shuffle, Volume2 } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { createSpeechRecognizer, speak, wordSimilarity } from '../services/speech'

const SAMPLE_SENTENCES = [
  'Artificial intelligence presents a double-edged sword for modern software engineering paradigms.',
  'To bridge the gap between technical complexity and business goals, we must leverage scalable architectures.',
  'It goes without saying that effective communication in distributed teams requires clear, unambiguous documentation.',
  'We should critically evaluate whether the current solution hits the nail on the head regarding user privacy.',
]

export default function Shadowing() {
  const { showToast } = useApp()
  const [sentence, setSentence] = useState(SAMPLE_SENTENCES[0])
  const [isRecording, setIsRecording] = useState(false)
  const [result, setResult] = useState(null)
  const recognizerRef = useRef(null)
  const sentenceRef = useRef(sentence)

  useEffect(() => {
    sentenceRef.current = sentence
  }, [sentence])

  useEffect(
    () => () => {
      recognizerRef.current?.abort?.()
      recognizerRef.current = null
    },
    [],
  )

  const getRecognizer = () => {
    if (recognizerRef.current) return recognizerRef.current
    const recognizer = createSpeechRecognizer({
      onResult: (transcript) => {
        const accuracy = wordSimilarity(sentenceRef.current, transcript)
        setResult({ transcript, accuracy })
        setIsRecording(false)
      },
      onError: () => {
        setIsRecording(false)
        showToast('No se pudo detectar voz. Inténtalo de nuevo.', 'warning')
      },
      onEnd: () => setIsRecording(false),
    })
    recognizerRef.current = recognizer
    return recognizer
  }

  const toggleRecording = () => {
    const recognizer = getRecognizer()
    if (!recognizer) {
      showToast('El navegador no soporta reconocimiento de voz nativo.', 'error')
      return
    }
    if (!isRecording) {
      recognizer.start()
      setIsRecording(true)
    } else {
      recognizer.stop()
      setIsRecording(false)
    }
  }

  const newSentence = () => {
    const next = SAMPLE_SENTENCES[Math.floor(Math.random() * SAMPLE_SENTENCES.length)]
    setSentence(next)
    setResult(null)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Mic className="h-5 w-5 text-emerald-400" /> Shadowing Studio (08:00 AM Routine)
            </h2>
            <p className="text-xs text-slate-400">
              Entrena tu pronunciación C1. Escucha el audio nativo y repítelo con el micrófono.
            </p>
          </div>
          <button
            type="button"
            onClick={newSentence}
            className="flex items-center gap-1.5 self-start rounded-xl bg-slate-700 px-3 py-2 text-xs text-slate-200 transition hover:bg-slate-600 sm:self-auto"
          >
            <Shuffle className="h-3.5 w-3.5" /> Nueva Frase C1
          </button>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center">
          <p className="text-lg font-medium leading-relaxed text-slate-100 sm:text-xl">
            "{sentence}"
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => speak(sentence)}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/30"
            >
              <Volume2 className="h-4 w-4" /> Escuchar Nativo
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <button
            type="button"
            onClick={toggleRecording}
            aria-label={isRecording ? 'Detener grabación' : 'Iniciar grabación'}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl shadow-xl transition active:scale-95 ${
              isRecording
                ? 'animate-pulse bg-red-500 text-white shadow-red-500/30'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20 hover:scale-105'
            }`}
          >
            <Mic className="h-8 w-8" />
          </button>
          <p className="text-xs text-slate-400">
            {isRecording
              ? 'Escuchando... ¡Habla ahora!'
              : 'Haz clic en el micrófono y lee la frase en voz alta...'}
          </p>
        </div>

        {result && (
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Lo que escuchó la App:</span>
              <span
                className={`rounded border px-2 py-0.5 font-bold ${
                  result.accuracy > 70
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                }`}
              >
                Precisión: {result.accuracy}%
              </span>
            </div>
            <p className="font-mono text-sm italic text-slate-300">"{result.transcript}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
