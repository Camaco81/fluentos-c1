export function speak(text, { lang = 'en-US', rate = 0.9 } = {}) {
  if (!('speechSynthesis' in window) || !text) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = rate
  window.speechSynthesis.speak(utterance)
  return true
}

export function createSpeechRecognizer({ lang = 'en-US', onResult, onError, onEnd }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return null

  const recognition = new SpeechRecognition()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = lang
  recognition.onresult = (event) => onResult(event.results[0][0].transcript)
  recognition.onerror = onError
  recognition.onend = onEnd
  return recognition
}

export function wordSimilarity(target, spoken) {
  const clean = (str) =>
    str
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(Boolean)
  const words1 = clean(target)
  const words2 = clean(spoken)
  const matches = words1.filter((w) => words2.includes(w)).length
  return Math.round((matches / Math.max(words1.length, 1)) * 100)
}
