import { Brain, CalendarCheck, Layers, MessagesSquare, MicVocal } from 'lucide-react'

const TABS = [
  { id: 'tracker', label: 'Plan & Tracker', icon: CalendarCheck },
  { id: 'miner', label: 'AI Sentence Miner', icon: Brain },
  { id: 'shadowing', label: 'Shadowing Studio', icon: MicVocal },
  { id: 'episoden', label: 'Episoden Prep & AI', icon: MessagesSquare },
  { id: 'deck', label: 'Repaso (Anki Cards)', icon: Layers },
]

export default function TabNav({ activeTab, onTabChange, deckCount }) {
  return (
    <nav className="mb-6 flex space-x-1 overflow-x-auto border-b border-slate-800 pb-3 text-sm font-medium sm:space-x-2">
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 transition ${
              active
                ? 'border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {id === 'deck' && (
              <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-300">
                {deckCount}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
