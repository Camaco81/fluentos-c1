import { memo } from 'react'

function HabitCheckbox({ habit, checked, onChange, accent = 'brand' }) {
  const accentClasses =
    accent === 'gold'
      ? 'accent-gold-500 focus:ring-gold-400'
      : 'accent-brand-500 focus:ring-brand-400'

  return (
    <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3 transition hover:border-slate-700 hover:bg-slate-900/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(habit.id)}
        aria-label={`Completar: ${habit.title}`}
        className={`mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 focus:ring-2 ${accentClasses}`}
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-200 transition group-hover:text-white">
          {habit.title}
        </div>
        <div className="text-xs text-slate-400">{habit.desc}</div>
      </div>
    </label>
  )
}

export default memo(HabitCheckbox)
