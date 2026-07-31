import {
  ChartColumn,
  CircleCheckBig,
  Lightbulb,
  Moon,
  ShieldHalf,
  Sun,
} from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { HABITS, HABIT_IDS, WEEK_DAYS, getTodayKey } from '../lib/routine'

const BLOCKS = [
  {
    key: 'morning',
    title: 'Bloque Mañana: Inglés C1-C2',
    time: '07:30 AM - 09:00 AM (90 minutos)',
    badge: 'Avance Avanzado',
    icon: Sun,
    iconClass: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
  },
  {
    key: 'evening',
    title: 'Bloque Noche: Chino HSK 1',
    time: '08:00 PM - 09:00 PM (60 minutos)',
    badge: 'Base Desde Cero',
    icon: Moon,
    iconClass: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-400',
  },
]

function HabitCheckbox({ habit, checked, onChange }) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 transition hover:border-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(habit.id)}
        className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-200 transition group-hover:text-emerald-300">
          {habit.title}
        </div>
        <div className="text-xs text-slate-400">{habit.desc}</div>
      </div>
    </label>
  )
}

export default function HabitTracker() {
  const { todayHabits, toggleHabit, todayProgress, habits } = useApp()

  const dateStr = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const dateTitle = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  const weekStatus = WEEK_DAYS.map((_, idx) => {
    const cursor = new Date()
    const dayOfWeek = (cursor.getDay() + 6) % 7
    const monday = new Date(cursor)
    monday.setDate(cursor.getDate() - dayOfWeek)
    const date = new Date(monday)
    date.setDate(monday.getDate() + idx)
    const day = habits[getTodayKey(date)] || {}
    return HABIT_IDS.every((id) => day[id])
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-xl sm:flex-row sm:items-center">
            <div>
              <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Rutina Diaria
              </span>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">{dateTitle}</h2>
              <p className="mt-1 text-xs text-slate-400">
                Inglés C1-C2 (Mañana) + Chino Mandarín HSK 1 (Noche)
              </p>
            </div>
            <div className="text-center">
              <div className="rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-2">
                <div className="text-2xl font-extrabold text-emerald-400">{todayProgress}%</div>
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
                className="space-y-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6"
              >
                <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-xl border p-2.5 ${block.iconClass}`}
                    >
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
                      onChange={toggleHabit}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="space-y-6">
          <div className="space-y-4 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
            <h3 className="flex items-center gap-2 font-bold text-slate-200">
              <ChartColumn className="h-4 w-4 text-emerald-400" /> Registro Semanal
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center">
              {WEEK_DAYS.map((day, idx) => (
                <div
                  key={day}
                  className="flex flex-col items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-2"
                >
                  <span className="text-[10px] font-medium text-slate-400">{day}</span>
                  <CircleCheckBig
                    className={`h-4 w-4 ${weekStatus[idx] ? 'text-emerald-400' : 'text-slate-600'}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <ShieldHalf className="h-4 w-4 text-amber-400" /> Regla Gramatical Chino
            </h3>
            <div className="space-y-1 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs text-slate-300">
              <div className="font-semibold text-emerald-400">Sujeto + Tiempo + Lugar + Acción</div>
              <div className="italic text-slate-400">Ejemplo: 我 今天 在家 吃饭</div>
              <div className="text-[11px] text-slate-400">(Yo + Hoy + En casa + Como)</div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-teal-950/20 p-6">
            <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-300">
              <Lightbulb className="h-4 w-4 text-emerald-400" /> Tip de Programador C1
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
