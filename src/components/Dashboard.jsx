import { useMemo } from 'react'
import {
  ArrowRight,
  Brain,
  Clock,
  Flame,
  Layers,
  MessagesSquare,
  MicVocal,
  Play,
  Trophy,
} from 'lucide-react'
import { useDeck } from '../hooks/useDeck'
import { useHabits } from '../hooks/useHabits'
import { deckStats, estimateSessionMinutes } from '../lib/sm2'
import { HABITS } from '../lib/routine'
import HabitCheckbox from './HabitCheckbox'

const RING_R = 34
const RING_C = 2 * Math.PI * RING_R

const QUICK = [
  {
    tab: 'miner',
    title: 'AI Sentence Miner',
    desc: 'Mina vocabulario C1/C2 y guárdalo en tu mazo.',
    icon: Brain,
  },
  {
    tab: 'shadowing',
    title: 'Shadowing Studio',
    desc: 'Entrena pronunciación repitiendo audio nativo.',
    icon: MicVocal,
  },
  {
    tab: 'episoden',
    title: 'Episoden Prep',
    desc: 'Genera temas de debate y practica con la IA.',
    icon: MessagesSquare,
  },
]

function Stat({ label, value, tone = 'brand' }) {
  const color =
    tone === 'gold' ? 'text-gold-300' : tone === 'muted' ? 'text-slate-200' : 'text-brand-300'
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2.5">
      <div className={`text-lg font-extrabold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const { deck } = useDeck()
  const { todayHabits, toggleHabit, todayProgress, streak, bestStreak } = useHabits()

  const stats = useMemo(() => deckStats(deck), [deck])
  const sessionMin = useMemo(() => estimateSessionMinutes(deck), [deck])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches'
  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dateTitle = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  const ringOffset = RING_C - (todayProgress / 100) * RING_C
  const morningDone = HABITS.filter((h) => h.block === 'morning' && todayHabits[h.id]).length
  const eveningDone = HABITS.filter((h) => h.block === 'evening' && todayHabits[h.id]).length

  return (
    <div className="space-y-6">
      <section className="glass fade-up flex flex-col justify-between gap-5 rounded-2xl p-6 shadow-xl sm:flex-row sm:items-center">
        <div>
          <span className="rounded-md border border-brand-500/25 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
            {greeting}
          </span>
          <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{dateTitle}</h2>
          <p className="mt-1 text-xs text-slate-400">
            Inglés C1-C2 (mañana) + Chino HSK 1 (noche). Tu día, en un vistazo.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border border-gold-500/25 bg-gold-500/10 px-2.5 py-1 text-xs font-semibold text-gold-300">
              <Flame className="h-3.5 w-3.5" /> Racha actual: {streak}
            </span>
            <span
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-semibold text-slate-300"
              title="Días consecutivos con todos los hábitos completados"
            >
              <Trophy className="h-3.5 w-3.5 text-gold-400" /> Mejor racha: {bestStreak}
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-semibold text-slate-300">
              <Layers className="h-3.5 w-3.5 text-brand-400" /> Mazo: {deck.length}
            </span>
          </div>
        </div>

        <div className="relative mx-auto h-24 w-24 shrink-0 sm:mx-0">
          <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
            <circle cx="40" cy="40" r={RING_R} fill="none" strokeWidth="8" className="stroke-slate-800" />
            <circle
              cx="40"
              cy="40"
              r={RING_R}
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={ringOffset}
              className={todayProgress === 100 ? 'stroke-brand-400' : 'stroke-brand-500'}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-white">{todayProgress}%</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Hoy</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Flame className="h-4 w-4 text-gold-400" /> Hábitos de hoy
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('tracker')}
                className="flex items-center gap-1 text-xs font-medium text-brand-300 transition hover:text-brand-200"
              >
                Ver rutina completa <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex gap-3 text-xs">
              <div className="flex flex-1 items-center gap-2">
                <span className="text-slate-400">Mañana (EN):</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-400 transition-all duration-500"
                    style={{ width: `${(morningDone / 3) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-brand-300">
                  {morningDone}/3
                </span>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <span className="text-slate-400">Noche (ZH):</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gold-400 transition-all duration-500"
                    style={{ width: `${(eveningDone / 3) * 100}%` }}
                  />
                </div>
                <span className="font-semibold text-gold-300">{eveningDone}/3</span>
              </div>
            </div>

            <div className="space-y-3">
              {HABITS.map((habit) => (
                <HabitCheckbox
                  key={habit.id}
                  habit={habit}
                  checked={!!todayHabits[habit.id]}
                  onChange={toggleHabit}
                  accent={habit.block === 'evening' ? 'gold' : 'brand'}
                />
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Layers className="h-4 w-4 text-brand-400" /> Repaso de hoy
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Nuevas" value={stats.fresh} />
              <Stat label="Debidas" value={stats.due} tone="gold" />
              <Stat label="Est." value={`${sessionMin}m`} tone="muted" />
            </div>
            <button
              type="button"
              onClick={() => onNavigate('deck', 'review')}
              disabled={stats.total === 0}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" /> Iniciar Repaso ({stats.total})
            </button>
            <p className="text-[11px] text-slate-400">
              SM-2 spaced repetition ·{' '}
              {stats.total === 0
                ? 'Sin tarjetas pendientes hoy.'
                : `${stats.fresh} nuevas + ${stats.due} de repaso.`}
            </p>
          </section>

          <section className="space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Clock className="h-4 w-4 text-brand-400" /> Atajos
            </h3>
            <div className="space-y-2">
              {QUICK.map(({ tab, title, desc, icon: Icon }) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onNavigate(tab)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-left transition hover:border-brand-500/30 hover:bg-slate-900/80"
                >
                  <Icon className="h-5 w-5 shrink-0 text-brand-400" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-slate-200 group-hover:text-brand-300">
                      {title}
                    </span>
                    <span className="block text-[11px] text-slate-400">{desc}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-brand-400" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
