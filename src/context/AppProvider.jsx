import { useCallback, useMemo } from 'react'
import { GoogleGenAI } from '@google/genai'
import useLocalStorage from '../hooks/useLocalStorage'
import { useToast } from '../hooks/useToast'
import { newSrsState } from '../lib/sm2'
import { HABIT_IDS, getTodayKey } from '../lib/routine'
import { AppContext } from './AppContext'

const GEMINI_MODEL = 'gemini-2.5-flash'

export function AppProvider({ children }) {
  const showToast = useToast()
  const [apiKey, setApiKey] = useLocalStorage('fluentos_gemini_key', '')
  const [deck, setDeck] = useLocalStorage('fluentos_deck', [])
  const [habits, setHabits] = useLocalStorage('fluentos_habits', {})

  const geminiClient = useMemo(() => (apiKey ? new GoogleGenAI({ apiKey }) : null), [apiKey])

  const callGemini = useCallback(
    async ({ systemInstruction = '', prompt, schema = null } = {}) => {
      if (!geminiClient) throw new Error('NO_API_KEY')

      const config = {
        ...(systemInstruction ? { systemInstruction } : {}),
        ...(schema ? { responseMimeType: 'application/json', responseSchema: schema } : {}),
      }

      const response = await geminiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config,
      })

      const text = response.text
      if (!text) throw new Error('EMPTY_RESPONSE')
      if (!schema) return text

      return JSON.parse(text.replace(/```json|```/gi, '').trim())
    },
    [geminiClient],
  )

  const addToDeck = useCallback(
    (card) => {
      const word = card.word || ''
      if (deck.some((item) => item.word.toLowerCase() === word.toLowerCase())) {
        return false
      }
      setDeck([
        { ...card, id: Date.now(), addedAt: new Date().toLocaleDateString(), srs: newSrsState() },
        ...deck,
      ])
      return true
    },
    [deck, setDeck],
  )

  const removeFromDeck = useCallback(
    (id) => setDeck(deck.filter((card) => card.id !== id)),
    [deck, setDeck],
  )

  const updateCard = useCallback(
    (id, patch) => setDeck(deck.map((card) => (card.id === id ? { ...card, ...patch } : card))),
    [deck, setDeck],
  )

  const exportDeck = useCallback(() => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(deck, null, 2))}`
    const anchor = document.createElement('a')
    anchor.setAttribute('href', dataStr)
    anchor.setAttribute('download', `fluentos_deck_${getTodayKey()}.json`)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }, [deck])

  const todayKey = getTodayKey()
  const todayHabits = useMemo(() => habits[todayKey] || {}, [habits, todayKey])
  const todayProgress = Math.round(
    (HABIT_IDS.filter((id) => todayHabits[id]).length / HABIT_IDS.length) * 100,
  )

  const toggleHabit = useCallback(
    (habitId) => {
      setHabits((prev) => {
        const day = prev[todayKey] || {}
        return { ...prev, [todayKey]: { ...day, [habitId]: !day[habitId] } }
      })
    },
    [setHabits, todayKey],
  )

  const streak = useMemo(() => {
    const isDone = (date) => {
      const day = habits[getTodayKey(date)] || {}
      return HABIT_IDS.every((id) => day[id])
    }
    let count = 0
    const cursor = new Date()
    if (!isDone(cursor)) cursor.setDate(cursor.getDate() - 1)
    while (isDone(cursor)) {
      count += 1
      cursor.setDate(cursor.getDate() - 1)
    }
    return count
  }, [habits])

  const value = useMemo(
    () => ({
      apiKey,
      setApiKey,
      hasKey: !!apiKey,
      callGemini,
      habits,
      deck,
      addToDeck,
      removeFromDeck,
      updateCard,
      exportDeck,
      showToast,
      todayHabits,
      toggleHabit,
      todayProgress,
      streak,
    }),
    [
      apiKey,
      callGemini,
      habits,
      deck,
      addToDeck,
      removeFromDeck,
      updateCard,
      exportDeck,
      showToast,
      todayHabits,
      toggleHabit,
      todayProgress,
      streak,
      setApiKey,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
