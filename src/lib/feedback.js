import confetti from 'canvas-confetti'

export function vibrate(pattern = 15) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern)
  }
}

export function fireConfetti() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  confetti({
    particleCount: 90,
    spread: 72,
    origin: { y: 0.7 },
    colors: ['#2dd4bf', '#14b8a6', '#fbbf24', '#f59e0b', '#f8fafc'],
    disableForReducedMotion: true,
  })
}
