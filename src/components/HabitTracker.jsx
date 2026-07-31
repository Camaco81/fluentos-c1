import { useEffect, useMemo, useRef } from 'react'
import {
  ChartColumn,
  CircleCheckBig,
  Flame,
  Lightbulb,
  Moon,
  ShieldHalf,
  Sun,
  Trophy,
} from 'lucide-react'
import { useHabits } from '../hooks/useHabits'
import { HABITS, HABIT_IDS, WEEK_DAYS, getTodayKey } from '../lib/routine'
import { fireConfetti, vibrate } from '../lib/feedback'
import HabitCheckbox from './HabitCheckbox'

const BLOCKS = [
  {
    key: 'morning',
    title: 'Bloque Mañana: Inglés C1-C2',
    time: '07:30 AM - 09:00 AM (90 minutos)',
    badge: 'Avance Avanzado',
    icon: Sun,
    accent: 'brand',
    iconClass: 'border-brand-500/20 bg-brand-500/10 text-brand-300',
  },
  {
    key: 'evening',
    title: 'Bloque Noche: Chino HSK 1',
    time: '08:00 PM - 09:00 PM (60 minutos)',
    badge: 'Base Desde Cero',
    icon: Moon,
    accent: 'gold',
    iconClass: 'border-gold-500/20 bg-gold-500/10 text-gold-300',
  },
]

function heatLevel(done, total) {
  if (done === 0) return 'bg-slate-800/70'
  if (done < total / 2) return 'bg-brand-900'
  if (done < total) return 'bg-brand-700'
  return 'bg-brand-400'
}

export default function HabitTracker() {
  const { todayHabits, toggleHabit, todayProgress, habits, streak, bestStreak } = useHabits()
  const celebratedRef = useRef(false)

  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dateTitle = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  const weekStatus = useMemo(
    () =>
      WEEK_DAYS.map((_, idx) => {
        const cursor = new Date()
        const dayOfWeek = (cursor.getDay() + 6) % 7
        const monday = new Date(cursor)
        monday.setDate(cursor.getDate() - dayOfWeek)
        const date = new Date(monday)
        date.setDate(monday.getDate() + idx)
        const day = habits[getTodayKey(date)] || {}
        return HABIT_IDS.every((id) => day[id])
      }),
    [habits],
  )

  const heatmap = useMemo(() => {
    const cursor = new Date()
    const dayOfWeek = (cursor.getDay() + 6) % 7
    const start = new Date(cursor)
    start.setDate(cursor.getDate() - dayOfWeek - 9 * 7)
    const todayKey = getTodayKey(cursor)
    const weeks = []
    for (let w = 0; w < 10; w++) {
      const week = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(start)
        date.setDate(start.getDate() + w * 7 + d)
        const key = getTodayKey(date)
        const day = habits[key] || {}
        const done = HABIT_IDS.filter((id) => day[id]).length
        week.push({ key, done, future: key > todayKey })
      }
      weeks.push(week)
    }
    return weeks
  }, [habits])

  useEffect(() => {
    if (todayProgress === 100) {
      if (!celebratedRef.current) {
        celebratedRef.current = true
        vibrate([60, 40, 60])
        fireConfetti()
      }
    } else {
      celebratedRef.current = false
    }
  }, [todayProgress])

  const handleToggle = (habitId) => {
    toggleHabit(habitId)
    vibrate(12)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass fade-up flex flex-col justify-between gap-4 rounded-2xl p-6 shadow-xl sm:flex-row sm:items-center">
            <div>
              <span className="rounded-md border border-brand-500/25 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-300">
                Rutina Diaria
              </span>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{dateTitle}</h2>
              <p className="mt-1 text-xs text-slate-400">
                Inglés C1-C2 (Mañana) + Chino Mandarín HSK 1 (Noche)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-lg border border-gold-500/25 bg-gold-500/10 px-2.5 py-1 text-xs font-semibold text-gold-300">
                  <Flame className="h-3.5 w-3.5" /> {streak} días de racha
                </span>
                <span
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-semibold text-slate-300"
                  title="Días consecutivos con todos los hábitos completados"
                >
                  <Trophy className="h-3.5 w-3.5 text-gold-400" /> Mejor: {bestStreak}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-2">
                <div className="text-2xl font-extrabold text-brand-400">{todayProgress}%</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Completado</div>
              </div>
            </div>
          </div>

          {BLOCKS.map((block) => {
            const Icon = block.icon
            const blockHabits = HABITS.filter((habit) => habit.block === block.key)
            return (
              <div
                key={block.key}
                className="fade-up space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6"
              >
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl border p-2.5 ${block.iconClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200">{block.title}</h3>
                      <p className="text-xs text-slate-400">{block.time}</p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-slate-700 px-2.5 py-1 text-xs text-slate-300">
                    {block.badge}
                  </span>
                </div>

                <div className="space-y-3">
                  {blockHabits.map((habit) => (
                    <HabitCheckbox
                      key={habit.id}
                      habit={habit}
                      checked={!!todayHabits[habit.id]}
                      onChange={handleToggle}
                      accent={block.accent}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <ChartColumn className="h-4 w-4 text-brand-400" /> Consistencia (10 semanas)
            </h3>
            <div className="flex justify-start gap-1.5 overflow-x-auto pb-1">
              {heatmap.map((week, w) => (
                <div key={w} className="flex flex-col gap-1.5">
                  {week.map((cell) => (
                    <div
                      key={cell.key}
                      title={`${cell.key}: ${cell.done}/${HABIT_IDS.length} hábitos${cell.future ? ' (futuro)' : ''}`}
                      className={`h-3 w-3 rounded-[3px] transition-colors ${cell.future ? 'bg-slate-900' : heatLevel(cell.done, HABIT_IDS.length)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              Menos
              {['bg-slate-800/70', 'bg-brand-900', 'bg-brand-700', 'bg-brand-400'].map((cls) => (
                <span key={cls} className={`h-2.5 w-2.5 rounded-[3px] ${cls}`} />
              ))}
              Más
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <h3 className="flex items-center gap-2 font-bold text-slate-200">
              <ChartColumn className="h-4 w-4 text-brand-400" /> Registro Semanal
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {WEEK_DAYS.map((day, idx) => (
                <div
                  key={day}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-2"
                >
                  <span className="text-[10px] font-medium text-slate-400">{day}</span>
                  <CircleCheckBig
                    className={`h-4 w-4 ${weekStatus[idx] ? 'text-brand-400' : 'text-slate-600'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-surface/60 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <ShieldHalf className="h-4 w-4 text-gold-400" /> Regla Gramatical Chino
            </h3>
            <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-300">
              <div className="font-semibold text-brand-300">Sujeto + Tiempo + Lugar + Acción</div>
              <div className="italic text-slate-400">Ejemplo: 我 今天 在家 吃饭</div>
              <div className="text-[11px] text-slate-400">(Yo + Hoy + En casa + Como)</div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-900/40 to-abyss-2 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-brand-300">
              <Lightbulb className="h-4 w-4 text-brand-400" /> Tip de Programador C1
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              No memorices palabras aisladas. Mining significa guardar{' '}
              <b>oraciones sintácticas completas</b>. Un término C1 como{' '}
              <i>"double-edged sword"</i> adquiere valor cuando aprendes la colocación:{' '}
              <i>"AI is a double-edged sword for tech teams."</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
