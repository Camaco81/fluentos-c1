import { useCallback, useState } from 'react'
import { ToastContext } from '../context/ToastContext'

const TOAST_STYLES = {
  success: 'bg-emerald-900/90 border-emerald-500 text-emerald-200',
  error: 'bg-red-900/90 border-red-500 text-red-200',
  warning: 'bg-amber-900/90 border-amber-500 text-amber-200',
  info: 'bg-slate-800/90 border-slate-600 text-slate-200',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = Date.now() + Math.random()
      setToasts((current) => [...current, { id, message, type }])
      window.setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-in pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-3 text-xs shadow-xl ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
