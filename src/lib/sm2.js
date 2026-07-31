export const DAY_MS = 24 * 60 * 60 * 1000

export const MIN_EF = 1.3

export function newSrsState() {
  return {
    ef: 2.5,
    interval: 0,
    reps: 0,
    due: Date.now(),
  }
}

export function isDue(card) {
  const due = card?.srs?.due ?? 0
  return due <= Date.now()
}

export function dueCount(deck) {
  return (deck || []).filter(isDue).length
}

export function deckStats(deck) {
  let fresh = 0
  let due = 0
  for (const card of deck || []) {
    if (!isDue(card)) continue
    if ((card.srs?.reps ?? 0) === 0) fresh += 1
    else due += 1
  }
  return { fresh, due, total: fresh + due }
}

export function estimateSessionMinutes(deck) {
  const { total } = deckStats(deck)
  return Math.max(1, Math.ceil((total * 10) / 60))
}

export function loadByDay(deck, days = 7) {
  const counts = new Array(days).fill(0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayMs = today.getTime()
  for (const card of deck || []) {
    const due = card.srs?.due
    if (typeof due !== 'number') continue
    if (due <= todayMs) {
      counts[0] += 1
      continue
    }
    const idx = Math.floor((due - todayMs) / DAY_MS)
    if (idx > 0 && idx < days) counts[idx] += 1
  }
  return counts
}

export function nextDueDate(state) {
  return new Date(state.due).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })
}

/**
 * SM-2 spaced repetition algorithm (SuperMemo-2).
 *
 * quality: 0-5 self-assessment of recall.
 *  - < 3: failed, schedule relearning tomorrow
 *  - >= 3: passed, interval grows with the easiness factor
 */
export function sm2(previous, quality) {
  const prev = previous || newSrsState()
  const ef = prev.ef || 2.5
  const interval = prev.interval || 0
  const reps = prev.reps || 0

  let nextEf
  let nextInterval
  let nextReps

  if (quality < 3) {
    nextEf = ef
    nextReps = 0
    nextInterval = 1
  } else {
    if (reps === 0) nextInterval = 1
    else if (reps === 1) nextInterval = 6
    else nextInterval = Math.round(interval * ef)
    nextReps = reps + 1
    nextEf = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if (nextEf < MIN_EF) nextEf = MIN_EF
  }

  return {
    ef: nextEf,
    interval: nextInterval,
    reps: nextReps,
    due: Date.now() + nextInterval * DAY_MS,
  }
}
