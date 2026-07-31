import { useState } from 'react'
import { ToastProvider } from './components/ToastProvider'
import { AppProvider } from './context/AppProvider'
import { useApp } from './hooks/useApp'
import Header from './components/Header'
import TabNav from './components/TabNav'
import HabitTracker from './components/HabitTracker'
import Miner from './components/Miner'
import Shadowing from './components/Shadowing'
import DebatePrep from './components/DebatePrep'
import Flashcards from './components/Flashcards'

function Main() {
  const { deck } = useApp()
  const [activeTab, setActiveTab] = useState('tracker')

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} deckCount={deck.length} />

        {activeTab === 'tracker' && <HabitTracker />}
        {activeTab === 'miner' && <Miner />}
        {activeTab === 'shadowing' && <Shadowing />}
        {activeTab === 'episoden' && <DebatePrep />}
        {activeTab === 'deck' && <Flashcards />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <Main />
      </AppProvider>
    </ToastProvider>
  )
}
