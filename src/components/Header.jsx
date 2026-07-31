import { useCallback, useState } from 'react'
import { Download, Flame, KeyRound } from 'lucide-react'
import logoUrl from '../assets/logo-fluentos.png'
import { useGemini } from '../hooks/useGemini'
import { useHabits } from '../hooks/useHabits'
import { usePwaInstall } from '../hooks/usePwa'
import ApiKeyModal from './ApiKeyModal'

function Header() {
  const { hasKey } = useGemini()
  const { streak } = useHabits()
  const { canInstall, installed, promptInstall } = usePwaInstall()
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)

  const closeModal = useCallback(() => setApiKeyModalOpen(false), [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-abyss/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={logoUrl}
            alt="FluentOS"
            className="h-9 w-auto shrink-0 rounded-lg ring-1 ring-slate-700/50 sm:h-10"
          />
          <div className="min-w-0">
            <h1 className="bg-gradient-to-r from-brand-300 to-gold-300 bg-clip-text text-lg font-bold leading-tight text-transparent">
              FluentOS
            </h1>
            <p className="hidden truncate text-xs text-slate-400 sm:block">
              English C1/C2 & Chinese HSK 1 PWA
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {canInstall && !installed && (
            <button
              type="button"
              onClick={promptInstall}
              aria-label="Instalar aplicación"
              className="flex items-center gap-1.5 rounded-lg border border-brand-500/30 bg-brand-500/10 px-2.5 py-1.5 text-xs font-medium text-brand-300 transition hover:bg-brand-500/20"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">Instalar</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setApiKeyModalOpen(true)}
            aria-label={hasKey ? 'Gemini Key activa. Abrir configuración.' : 'Ingresar Gemini API Key'}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-700"
          >
            <KeyRound className={`h-3.5 w-3.5 ${hasKey ? 'text-brand-400' : 'text-gold-400'}`} />
            <span className={hasKey ? 'font-semibold text-brand-300' : 'text-gold-400'}>
              {hasKey ? 'Key Activa' : 'API Key'}
            </span>
          </button>

          <div className="hidden h-6 w-px bg-slate-800 md:block" />

          <div
            className="hidden items-center gap-1.5 rounded-lg border border-gold-500/25 bg-gold-500/10 px-3 py-1.5 text-xs font-bold text-gold-300 md:flex"
            title={`Mejor racha: consulta el panel de inicio`}
          >
            <Flame className="h-3.5 w-3.5" />
            {streak} días
          </div>
        </div>
      </div>

      <ApiKeyModal open={apiKeyModalOpen} onClose={closeModal} />
    </header>
  )
}

export default Header
