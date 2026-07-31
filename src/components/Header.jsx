import { useState } from 'react'
import { Download, Flame, KeyRound } from 'lucide-react'
import { useApp } from '../hooks/useApp'
import { usePwaInstall } from '../hooks/usePwa'
import ApiKeyModal from './ApiKeyModal'

export default function Header() {
  const { hasKey, streak } = useApp()
  const { canInstall, installed, promptInstall } = usePwaInstall()
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-xl font-black text-slate-950 shadow-lg shadow-emerald-500/20">
            F
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-lg font-bold text-transparent">
              FluentOS
            </h1>
            <p className="hidden text-xs text-slate-400 sm:block">
              English C1/C2 & Chinese HSK 1 PWA
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {canInstall && !installed && (
            <button
              type="button"
              onClick={promptInstall}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Instalar PWA</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setApiKeyModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700"
          >
            <KeyRound className="h-3.5 w-3.5 text-amber-400" />
            <span className={hasKey ? 'font-semibold text-emerald-400' : 'text-amber-400'}>
              {hasKey ? 'Key Activa' : 'Ingresar Key'}
            </span>
          </button>

          <div className="h-6 w-px bg-slate-800" />

          <div className="hidden text-right text-xs md:block">
            <div className="font-bold text-amber-400">
              <Flame className="mr-1 inline h-3.5 w-3.5" />
              {streak} Días de Racha
            </div>
          </div>
        </div>
      </div>

      <ApiKeyModal open={apiKeyModalOpen} onClose={() => setApiKeyModalOpen(false)} />
    </header>
  )
}
