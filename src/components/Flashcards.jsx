import { useState } from 'react'
import { Eye, FileDown, Layers, PlayCircle, Trash2, Volume2, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { speak } from '../services/speech'
import { dueCount, isDue, nextDueDate, sm2 } from '../lib/sm2'

const GRADES = [
  {
    label: 'Again',
    quality: 1,
    className:
      'border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25',
  },
  {
    label: 'Hard',
    quality: 3,
    className:
      'border-amber-500/30 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25',
  },
  {
    label: 'Good',
    quality: 4,
    className:
      'border-emerald-500/30 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25',
  },
  {
    label: 'Easy',
    quality: 5,
    className:
      'border-teal-500/30 bg-teal-500/15 text-teal-300 hover:bg-teal-500/25',
  },
]

export default function Flashcards() {
  const { deck, removeFromDeck, updateCard, exportDeck, showToast } = useApp()
  const [reviewing, setReviewing] = useState(false)
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const pendingCount = dueCount(deck)

  const startReview = () => {
    const due = deck.filter(isDue)
    if (due.length === 0) {
      showToast('¡No hay tarjetas pendientes hoy! Vuelve pronto.', 'info')
      return
    }
    setQueue(due)
    setIndex(0)
    setRevealed(false)
    setReviewing(true)
  }

  const cancelReview = () => {
    setReviewing(false)
    setQueue([])
    setRevealed(false)
  }

  const gradeCard = (quality) => {
    const card = queue[index]
    updateCard(card.id, { srs: sm2(card.srs, quality) })
    if (index + 1 >= queue.length) {
      setReviewing(false)
      showToast('🎉 Repaso completado. ¡Buen trabajo!', 'success')
    } else {
      setIndex(index + 1)
      setRevealed(false)
    }
  }

  const current = queue[index]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-700/60 bg-slate-800/60 p-6 shadow-xl sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Layers className="h-5 w-5 text-emerald-400" /> Mazo de Repaso Espaciado
          </h2>
          <p className="text-xs text-slate-400">
            Tus palabras minadas almacenadas para retención a largo plazo (SM-2).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-300">
            {pendingCount} pendientes hoy
          </span>
          <button
            type="button"
            onClick={exportDeck}
            className="flex items-center gap-1.5 rounded-xl bg-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-600"
          >
            <FileDown className="h-3.5 w-3.5" /> Exportar
          </button>
          <button
            type="button"
            onClick={startReview}
            disabled={pendingCount === 0}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-600 disabled:opacity-60"
          >
            <PlayCircle className="h-3.5 w-3.5" /> Iniciar Repaso
          </button>
        </div>
      </div>

      {reviewing && current && (
        <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-slate-800/60 p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Tarjeta {index + 1} de {queue.length}
            </span>
            <button
              type="button"
              onClick={cancelReview}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" /> Terminar
            </button>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <h3 className="text-2xl font-black text-emerald-400">{current.word}</h3>
              <span className="font-mono text-sm text-slate-400">{current.phonetic}</span>
              <button
                type="button"
                onClick={() => speak(current.word)}
                aria-label="Escuchar palabra"
                className="rounded-md bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-slate-600"
              >
                <Volume2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {revealed ? (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <p className="text-sm text-slate-300">{current.definition}</p>
                  <p className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-[11px] italic leading-relaxed text-slate-400">
                    "{current.sentence}"
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {GRADES.map((grade) => (
                    <button
                      key={grade.label}
                      type="button"
                      onClick={() => gradeCard(grade.quality)}
                      className={`rounded-xl border px-5 py-2.5 text-xs font-bold transition ${grade.className}`}
                    >
                      {grade.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-2.5 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
              >
                <Eye className="h-3.5 w-3.5" /> Mostrar respuesta
              </button>
            )}
          </div>
        </div>
      )}

      {!reviewing &&
        (deck.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 p-12 text-center text-xs text-slate-500">
            Tu mazo está vacío. Utiliza el <b className="text-emerald-400">AI Sentence Miner</b> para
            agregar vocabulario C1.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deck.map((card) => (
              <div
                key={card.id}
                className="group relative space-y-3 rounded-xl border border-slate-700/60 bg-slate-800/60 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-emerald-400">{card.word}</h4>
                    <span className="font-mono text-xs text-slate-400">{card.phonetic}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => speak(card.word)}
                      aria-label={`Escuchar ${card.word}`}
                      className="rounded-lg bg-slate-700 p-2 text-xs text-slate-200 transition hover:bg-slate-600"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeFromDeck(card.id)
                        showToast('Tarjeta eliminada.', 'info')
                      }}
                      aria-label={`Eliminar ${card.word}`}
                      className="rounded-lg bg-slate-700 p-2 text-xs text-red-400 transition hover:bg-slate-600 hover:text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300">{card.definition}</p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-[11px] italic leading-relaxed text-slate-400">
                  "{card.sentence}"
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                  <span>Añadido: {card.addedAt}</span>
                  {isDue(card) ? (
                    <span className="font-semibold text-emerald-400">Pendiente hoy</span>
                  ) : (
                    <span>Siguiente: {nextDueDate(card.srs)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
    </div>
  )
}
