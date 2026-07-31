import { useEffect, useMemo, useState } from 'react'
import { Eye, FileDown, Layers, Play, Trash2, Volume2, X } from 'lucide-react'
import { useDeck } from '../hooks/useDeck'
import { useToast } from '../hooks/useToast'
import { speak } from '../services/speech'
import { deckStats, estimateSessionMinutes, isDue, loadByDay, nextDueDate, sm2 } from '../lib/sm2'
import { fireConfetti, vibrate } from '../lib/feedback'

const GRADES = [
  {
    label: 'Again',
    quality: 1,
    className: 'border-red-500/30 bg-red-500/15 text-red-300 hover:bg-red-500/25',
  },
  {
    label: 'Hard',
    quality: 3,
    className: 'border-gold-500/30 bg-gold-500/15 text-gold-300 hover:bg-gold-500/25',
  },
  {
    label: 'Good',
    quality: 4,
    className: 'border-brand-500/30 bg-brand-500/15 text-brand-300 hover:bg-brand-500/25',
  },
  {
    label: 'Easy',
    quality: 5,
    className: 'border-teal-500/30 bg-teal-500/15 text-teal-300 hover:bg-teal-500/25',
  },
]

const LOAD_LABELS = ['Hoy', '+1', '+2', '+3', '+4', '+5', '+6']

export default function Flashcards({ autoReview, onAutoReviewHandled }) {
  const { deck, removeFromDeck, updateCard, exportDeck, exportAnki } = useDeck()
  const showToast = useToast()
  const [reviewing, setReviewing] = useState(false)
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const stats = useMemo(() => deckStats(deck), [deck])
  const sessionMin = useMemo(() => estimateSessionMinutes(deck), [deck])
  const load = useMemo(() => loadByDay(deck, 7), [deck])
  const maxLoad = Math.max(...load, 1)

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

  useEffect(() => {
    if (autoReview) {
      startReview()
      onAutoReviewHandled?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoReview])

  const cancelReview = () => {
    setReviewing(false)
    setQueue([])
    setRevealed(false)
  }

  const gradeCard = (quality) => {
    const card = queue[index]
    updateCard(card.id, { srs: sm2(card.srs, quality) })
    vibrate(12)
    if (index + 1 >= queue.length) {
      setReviewing(false)
      fireConfetti()
      showToast('¡Repaso completado! Excelente trabajo.', 'success')
    } else {
      setIndex(index + 1)
      setRevealed(false)
    }
  }

  const current = queue[index]

  return (
    <div className="space-y-6">
      <div className="glass fade-up flex flex-col justify-between gap-4 rounded-2xl p-6 shadow-xl sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-white">
            <Layers className="h-5 w-5 text-brand-400" /> Mazo de Repaso Espaciado
          </h2>
          <p className="text-xs text-slate-400">
            Tus palabras minadas almacenadas para retención a largo plazo (SM-2).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportAnki}
            aria-label="Exportar a Anki (archivo de texto con separadores)"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-700"
          >
            <FileDown className="h-3.5 w-3.5" /> Anki
          </button>
          <button
            type="button"
            onClick={exportDeck}
            aria-label="Exportar mazo a JSON"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300 transition hover:bg-slate-700"
          >
            <FileDown className="h-3.5 w-3.5" /> JSON
          </button>
          <button
            type="button"
            onClick={startReview}
            disabled={stats.total === 0}
            className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-brand-400 disabled:opacity-60"
          >
            <Play className="h-3.5 w-3.5" /> Iniciar Repaso
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6 lg:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sesión de hoy
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-2xl font-extrabold text-brand-400">{stats.fresh}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Nuevas</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-2xl font-extrabold text-gold-400">{stats.due}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Debidas</div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="text-2xl font-extrabold text-slate-200">{sessionMin}′</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">Tiempo est.</div>
            </div>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Curva de carga próxima (repasos por día)</span>
              <span>{stats.total} pendientes hoy</span>
            </div>
            <div className="flex items-end gap-2">
              {load.map((n, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-16 w-full items-end rounded-md bg-slate-800/40">
                    <div
                      className={`w-full rounded-md transition-colors ${
                        i === 0 ? 'bg-brand-400' : 'bg-slate-600'
                      }`}
                      style={{ height: `${n === 0 ? 4 : Math.max(12, (n / maxLoad) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400">{LOAD_LABELS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {reviewing && current ? (
          <div className="fade-up space-y-4 rounded-2xl border border-brand-500/25 bg-surface/60 p-6 shadow-xl lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Tarjeta {index + 1} de {queue.length}
              </span>
              <button
                type="button"
                onClick={cancelReview}
                className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-white"
              >
                <X className="h-3.5 w-3.5" /> Terminar
              </button>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 text-center">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <h3 className="text-2xl font-black text-brand-400">{current.word}</h3>
                <span className="font-mono text-sm text-slate-400">{current.phonetic}</span>
                <button
                  type="button"
                  onClick={() => speak(current.word)}
                  aria-label={`Escuchar ${current.word}`}
                  className="rounded-md bg-slate-700 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-slate-600"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {(current.tags || []).length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-brand-500/25 bg-brand-500/10 px-1.5 py-0.5 text-[10px] font-medium text-brand-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

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
                        aria-label={`Calificar ${grade.label}`}
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
                  className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-5 py-2.5 text-xs font-semibold text-brand-300 transition hover:bg-brand-500/20"
                >
                  <Eye className="h-3.5 w-3.5" /> Mostrar respuesta
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <p className="text-xs leading-relaxed text-slate-400">
              {stats.total === 0
                ? 'No hay repasos pendientes hoy. ¡Genial, estás al día! Usa el AI Sentence Miner para añadir vocabulario C1.'
                : 'Pulsa "Iniciar Repaso" para trabajar tu sesión de repaso espaciado.'}
            </p>
          </div>
        )}
      </div>

      {!reviewing &&
        (deck.length === 0 ? (
          <div className="rounded-2xl border border-slate-700/50 bg-surface/60 p-12 text-center text-xs text-slate-400">
            Tu mazo está vacío. Utiliza el <b className="text-brand-400">AI Sentence Miner</b> para
            agregar vocabulario C1.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deck.map((card) => (
              <div
                key={card.id}
                className="group relative space-y-3 rounded-xl border border-slate-700/60 bg-surface/60 p-4 transition hover:border-slate-600"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-brand-400">{card.word}</h4>
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

                {(card.tags || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>Añadido: {card.addedAt}</span>
                  {isDue(card) ? (
                    <span className="font-semibold text-brand-400">Pendiente hoy</span>
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
