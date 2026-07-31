import { useContext } from 'react'
import { HabitsContext } from '../context/AppContexts'

export function useHabits() {
  const ctx = useContext(HabitsContext)
  if (!ctx) throw new Error('useHabits must be used within an AppProvider')
  return ctx
}
