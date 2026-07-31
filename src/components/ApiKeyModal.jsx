import { useEffect, useState } from 'react'
import { KeyRound, X } from 'lucide-react'
import { useApp } from '../hooks/useApp'

export default function ApiKeyModal({ open, onClose }) {
  const { apiKey, setApiKey, showToast } = useApp()
  const [value, setValue] = useState(apiKey)

  useEffect(() => {
    if (open) setValue(apiKey)
  }, [open, apiKey])

  if (!open) return null

  const handleSave = () => {
    setApiKey(value.trim())
    showToast('Gemini Key guardada exitosamente.', 'success')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="flex items-center gap-2 text-base font-bold text-white">
            <KeyRound className="h-4 w-4 text-amber-400" /> Configurar Gemini API Key
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs leading-relaxed text-slate-300">
          FluentOS utiliza el modelo <b>Gemini 2.5 Flash</b> de Google para minar oraciones y
          simular debates C1. Tu clave se almacena localmente en tu navegador (`localStorage`).
        </p>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
          }}
          placeholder="AIzaSy..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-600"
          >
            Guardar Key
          </button>
        </div>
      </div>
    </div>
  )
}
