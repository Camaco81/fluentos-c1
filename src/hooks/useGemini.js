import { useContext } from 'react'
import { GeminiContext } from '../context/AppContexts'

export function useGemini() {
  const ctx = useContext(GeminiContext)
  if (!ctx) throw new Error('useGemini must be used within an AppProvider')
  return ctx
}
