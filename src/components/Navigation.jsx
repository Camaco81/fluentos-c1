import { memo } from 'react'
import {
  Brain,
  CalendarCheck,
  Layers,
  LayoutDashboard,
  MessagesSquare,
  MicVocal,
} from 'lucide-react'

const TABS = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'tracker', label: 'Rutina', icon: CalendarCheck },
  { id: 'miner', label: 'Miner', icon: Brain },
  { id: 'shadowing', label: 'Shadow', icon: MicVocal },
  { id: 'episoden', label: 'Debate', icon: MessagesSquare },
  { id: 'deck', label: 'Repaso', icon: Layers },
]

function handleTabKeyDown(e, idx, prefix, onTabChange) {
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return
  e.preventDefault()
  let next = idx
  if (e.key === 'Home') next = 0
  else if (e.key === 'End') next = TABS.length - 1
  else if (e.key === 'ArrowRight') next = (idx + 1) % TABS.length
  else next = (idx - 1 + TABS.length) % TABS.length
  document.getElementById(`${prefix}-tab-${TABS[next].id}`)?.focus()
  onTabChange(TABS[next].id)
}

function TopNav({ activeTab, onTabChange, dueCount }) {
  return (
    <div role="tablist" aria-label="Navegación principal" className="hidden flex-wrap gap-1 md:flex">
      {TABS.map((tab, idx) => {
        const active = activeTab === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`top-tab-${tab.id}`}
            aria-selected={active}
            aria-controls={`panel-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleTabKeyDown(e, idx, 'top', onTabChange)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition ${
              active
                ? 'border-brand-500/40 bg-brand-500/15 text-brand-300'
                : 'border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {tab.id === 'deck' && dueCount > 0 && (
              <span className="ml-1 rounded-full bg-brand-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-brand-300">
                {dueCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function BottomNav({ activeTab, onTabChange, dueCount }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegación principal móvil"
    >
      <div role="tablist" className="glass flex">
        {TABS.map((tab, idx) => {
          const active = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`bottom-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={`panel-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, idx, 'bottom', onTabChange)}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                active ? 'text-brand-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              {tab.label}
              {active && <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-brand-400" />}
              {tab.id === 'deck' && dueCount > 0 && (
                <span className="absolute right-[calc(50%-20px)] top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-brand-500 px-1 text-[8px] font-bold text-slate-950">
                  {dueCount}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

function Navigation({ activeTab, onTabChange, dueCount }) {
  return (
    <>
      <TopNav activeTab={activeTab} onTabChange={onTabChange} dueCount={dueCount} />
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} dueCount={dueCount} />
    </>
  )
}

export default memo(Navigation)
