import { useState } from 'react'
import {
  Bookmark,
  LoaderCircle,
  Quote,
  Search,
  Tags,
  Volume2,
  WandSparkles,
} from 'lucide-react'
import { useGemini } from '../hooks/useGemini'
import { useDeck } from '../hooks/useDeck'
import { useToast } from '../hooks/useToast'
import { speak } from '../services/speech'
import { vibrate } from '../lib/feedback'

const MINER_SYSTEM =
  'You are a world-class linguist and English coach specialized in helping B2 speakers transition to C1/C2 level. Respond ONLY with valid JSON matching the provided schema.'

const MINER_SCHEMA = {
  type: 'object',
  properties: {
    word: { type: 'string' },
    phonetic: { type: 'string' },
    definition: { type: 'string' },
    sentences: { type: 'array', items: { type: 'string' } },
    collocations: { type: 'array', items: { type: 'string' } },
  },
  required: ['word', 'definition', 'sentences', 'collocations'],
}

const TAG_OPTIONS = [
  'Tech',
  'Business',
  'Daily Life',
  'Debate',
  'Idiom',
  'Phrasal Verb',
  'Formal',
  'Colloquial',
]

export default function Miner() {
  const { callGemini } = useGemini()
  const { addToDeck } = useDeck()
  const showToast = useToast()
  const [wordInput, setWordInput] = useState('')
  const [selectedTags, setSelectedTags] = useState(['Tech', 'Business'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    )
  }

  const mineWord = async () => {
    const word = wordInput.trim()
    if (!word) {
      showToast('Por favor ingresa una palabra o frase C1.', 'warning')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const data = await callGemini({
        systemInstruction: MINER_SYSTEM,
        prompt: `Analyze the English C1/C2 term or phrase: "${word}". Provide the definition as a concise Spanish definition including the usage register (Formal/Colloquial/Idiom). Sentences must be 3 high-level C1/C2 context sentences in tech, business, or debate. Collocations must be 3 common collocations or synonyms.`,
        schema: MINER_SCHEMA,
      })
      setResult(data)
    } catch (err) {
      console.error(err)
      showToast(
        err.message === 'NO_API_KEY'
          ? 'Configura tu Gemini API Key en la barra superior.'
          : 'Error al conectar con la API de Gemini. Revisa tu Key.',
        'error',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    if (!result) return
    const added = addToDeck({
      word: result.word,
      phonetic: result.phonetic || '/IPA/',
      definition: result.definition,
      sentence: result.sentences?.[0] || '',
      tags: selectedTags,
    })
    vibrate(20)
    showToast(
      added ? `¡"${result.word}" guardada en tu mazo de repaso!` : 'La palabra ya existe en tu mazo.',
      added ? 'success' : 'warning',
    )
  }

  return (
    <div className="space-y-6">
      <div className="glass fade-up space-y-4 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <WandSparkles className="h-5 w-5 text-brand-400" /> AI Sentence Miner (Gemini
              Powered)
            </h2>
            <p className="text-xs text-slate-400">
              Ingresa una palabra, expresión o phrasal verb en inglés. La IA generará el análisis
              C1 y oraciones de alto nivel.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={wordInput}
            onChange={(e) => setWordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') mineWord()
            }}
            aria-label="Palabra o frase en inglés C1 para analizar"
            placeholder="Ej: double-edged sword, leverage, ubiquitous, hit the nail on the head..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={mineWord}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-brand-500/10 transition hover:from-brand-400 hover:to-brand-500 disabled:opacity-60"
          >
            <Search className="h-4 w-4" /> Analizar C1
          </button>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            <Tags className="h-3.5 w-3.5" /> Etiquetas de contexto para esta palabra:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {TAG_OPTIONS.map((tag) => {
              const active = selectedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  aria-pressed={active}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                    active
                      ? 'border-brand-500/40 bg-brand-500/15 text-brand-300'
                      : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {loading && (
        <div className="space-y-3 py-12 text-center">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-brand-400" />
          <p className="text-xs text-slate-400">
            Consultando Gemini AI & generando contexto avanzado C1/C2...
          </p>
        </div>
      )}

      {result && (
        <div className="fade-up space-y-6 rounded-2xl border border-slate-700 bg-surface/80 p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-700/60 pb-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-black text-brand-400">{result.word}</h3>
                <span className="font-mono text-sm text-slate-400">{result.phonetic || '/IPA/'}</span>
                <button
                  type="button"
                  onClick={() => speak(result.word)}
                  aria-label="Escuchar palabra"
                  className="rounded-md bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-slate-600"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-1 text-sm text-slate-300">{result.definition}</p>
              {selectedTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-brand-500/25 bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 self-start rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-brand-400 sm:self-auto"
            >
              <Bookmark className="h-3.5 w-3.5" /> Guardar en Mazo (Anki)
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Quote className="h-3.5 w-3.5 text-brand-400" /> Oraciones de Contexto C1/C2
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {(result.sentences || []).map((sentence, idx) => (
                  <li
                    key={idx}
                    className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 leading-relaxed"
                  >
                    <Quote className="mr-1.5 inline h-3 w-3 text-brand-400" />
                    "{sentence}"
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Tags className="h-3.5 w-3.5 text-brand-400" /> Colocaciones & Sinónimos
              </h4>
              <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300">
                {(result.collocations || []).map((collocation, idx) => (
                  <span
                    key={idx}
                    className="mb-1 mr-1.5 inline-block rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-brand-300"
                  >
                    {collocation}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
