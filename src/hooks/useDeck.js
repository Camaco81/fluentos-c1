import { useContext } from 'react'
import { DeckContext } from '../context/AppContexts'

export function useDeck() {
  const ctx = useContext(DeckContext)
  if (!ctx) throw new Error('useDeck must be used within an AppProvider')
  return ctx
}
