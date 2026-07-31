export const HABITS = [
  {
    id: 'en1',
    block: 'morning',
    title: 'Absorción y Vocabulario (07:30 - 08:00)',
    desc: 'L/M/V: Videos TED/Ingeniería + anotar 3-5 palabras C1 en Miner. Mar/Jue: Lectura técnica.',
  },
  {
    id: 'en2',
    block: 'morning',
    title: 'Práctica de Shadowing (08:00 - 08:15)',
    desc: 'Repetir en voz alta 1 min del audio copiando entonación, ritmo y velocidad nativa.',
  },
  {
    id: 'en3',
    block: 'morning',
    title: 'Conversación Activa en Episoden (08:15 - 09:00)',
    desc: 'Forzar el uso de al menos 2 palabras/frases C1 aprendidas hoy en tu diálogo.',
  },
  {
    id: 'zh1',
    block: 'evening',
    title: 'Fonética, Tonos y Pinyin (20:00 - 20:20)',
    desc: 'Entrenar los 4 tonos en voz alta con Pinyin Chart / HelloChinese.',
  },
  {
    id: 'zh2',
    block: 'evening',
    title: 'Lección HelloChinese & Gramática (20:20 - 20:45)',
    desc: 'Completar 1 lección interactiva. Recordar: Sujeto + Tiempo + Lugar + Acción.',
  },
  {
    id: 'zh3',
    block: 'evening',
    title: 'Repaso Hanzi y Reconocimiento (20:45 - 21:00)',
    desc: 'Asociar el carácter visual (Hanzi) con Pinyin. Practicar escritura digital Pinyin.',
  },
]

export const HABIT_IDS = HABITS.map((habit) => habit.id)

export const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']

export function getTodayKey(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
