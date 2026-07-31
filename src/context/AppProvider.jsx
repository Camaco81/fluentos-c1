import { useCallback, useEffect, useMemo, useRef } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { newSrsState } from '../lib/sm2'
import { HABIT_IDS, getTodayKey } from '../lib/routine'
import { GeminiContext, DeckContext, HabitsContext } from './AppContexts'

const GEMINI_MODEL = 'gemini-2.5-flash'

export function AppProvider({ children }) {
  const [apiKey, setApiKey] = useLocalStorage('fluentos_gemini_key', '')
  const apiKeyRef = useRef(apiKey)
  useEffect(() => {
    apiKeyRef.current = apiKey
  }, [apiKey])

  const callGemini = useCallback(async ({ systemInstruction = '', prompt, schema = null } = {}) => {
    const key = apiKeyRef.current
    if (!key) throw new Error('NO_API_KEY')

    const { GoogleGenAI } = await import('@google/genai')
    const client = new GoogleGenAI({ apiKey: key })

    const config = {
      ...(systemInstruction ? { systemInstruction } : {}),
      ...(schema ? { responseMimeType: 'application/json', responseSchema: schema } : {}),
    }

    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config,
    })

    const text = response.text
    if (!text) throw new Error('EMPTY_RESPONSE')
    if (!schema) return text

    return JSON.parse(text.replace(/```json|```/gi, '').trim())
  }, [])

  const geminiValue = useMemo(
    () => ({ apiKey, setApiKey, hasKey: !!apiKey, callGemini }),
    [apiKey, setApiKey, callGemini],
  )

  const [deck, setDeck] = useLocalStorage('fluentos_deck', [])
  const deckRef = useRef(deck)
  useEffect(() => {
    deckRef.current = deck
  }, [deck])

  const addToDeck = useCallback(
    (card) => {
      const word = (card.word || '').toLowerCase()
      if (deckRef.current.some((item) => (item.word || '').toLowerCase() === word)) return false
      const newCard = {
        ...card,
        id: Date.now(),
        addedAt: new Date().toLocaleDateString(),
        srs: newSrsState(),
      }
      setDeck((prev) => [newCard, ...prev])
      return true
    },
    [setDeck],
  )

  const removeFromDeck = useCallback((id) => setDeck((prev) => prev.filter((c) => c.id !== id)), [setDeck])

  const updateCard = useCallback(
    (id, patch) => setDeck((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))),
    [setDeck],
  )

  const exportDeck = useCallback(() => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(deckRef.current, null, 2),
    )}`
    const anchor = document.createElement('a')
    anchor.setAttribute('href', dataStr)
    anchor.setAttribute('download', `fluentos_deck_${getTodayKey()}.json`)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
  }, [])

  const exportAnki = useCallback(() => {
    const rows = deckRef.current.map((card) => {
      const back = [card.definition, card.sentence].filter(Boolean).join('<br>')
      const tags = (card.tags || []).join(' ')
      return [card.word, back, tags].join('\t')
    })
    const content = `#separator:tab\n#html:false\n#tags column:3\n${rows.join('\n')}`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.setAttribute('href', url)
    anchor.setAttribute('download', `fluentos_anki_${getTodayKey()}.txt`)
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }, [])

  const deckValue = useMemo(
    () => ({ deck, addToDeck, removeFromDeck, updateCard, exportDeck, exportAnki }),
    [deck, addToDeck, removeFromDeck, updateCard, exportDeck, exportAnki],
  )

  const [habits, setHabits] = useLocalStorage('fluentos_habits', {})

  const todayKey = getTodayKey()
  const todayHabits = useMemo(() => habits[todayKey] || {}, [habits, todayKey])

  const toggleHabit = useCallback(
    (habitId) => {
      setHabits((prev) => {
        const day = prev[todayKey] || {}
        return { ...prev, [todayKey]: { ...day, [habitId]: !day[habitId] } }
      })
    },
    [setHabits, todayKey],
  )

  const todayProgress = useMemo(() => {
    const done = HABIT_IDS.filter((id) => todayHabits[id]).length
    return Math.round((done / HABIT_IDS.length) * 100)
  }, [todayHabits])

  const { streak, bestStreak } = useMemo(() => {
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

    let best = 0
    let run = 0
    const completed = Object.keys(habits).filter((key) =>
      HABIT_IDS.every((id) => habits[key][id]),
    )
    completed.sort()
    let prevDate = null
    for (const key of completed) {
      const cur = new Date(`${key}T12:00:00`)
      if (prevDate && cur.getTime() === prevDate.getTime() + 86400000) {
        run += 1
      } else {
        run = 1
      }
      if (run > best) best = run
      prevDate = cur
    }

    return { streak: count, bestStreak: best }
  }, [habits])

  const habitsValue = useMemo(
    () => ({ habits, todayHabits, toggleHabit, todayProgress, streak, bestStreak }),
    [habits, todayHabits, toggleHabit, todayProgress, streak, bestStreak],
  )

  return (
    <GeminiContext.Provider value={geminiValue}>
      <DeckContext.Provider value={deckValue}>
        <HabitsContext.Provider value={habitsValue}>{children}</HabitsContext.Provider>
      </DeckContext.Provider>
    </GeminiContext.Provider>
  )
}
