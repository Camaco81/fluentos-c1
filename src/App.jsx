import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { ToastProvider } from './components/ToastProvider'
import { AppProvider } from './context/AppProvider'
import { useDeck } from './hooks/useDeck'
import { deckStats } from './lib/sm2'
import Header from './components/Header'
import Navigation from './components/Navigation'

const Dashboard = lazy(() => import('./components/Dashboard'))
const HabitTracker = lazy(() => import('./components/HabitTracker'))
const Miner = lazy(() => import('./components/Miner'))
const Shadowing = lazy(() => import('./components/Shadowing'))
const DebatePrep = lazy(() => import('./components/DebatePrep'))
const Flashcards = lazy(() => import('./components/Flashcards'))

function Fallback() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-400" />
    </div>
  )
}

function Main() {
  const { deck } = useDeck()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [deckIntent, setDeckIntent] = useState(null)

  const navigate = useCallback((tab, intent) => {
    setActiveTab(tab)
    if (intent) setDeckIntent(intent)
  }, [])

  const dueStats = useMemo(() => deckStats(deck), [deck])

  return (
    <div className="flex min-h-screen flex-col antialiased">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-28 pt-6 sm:px-6 md:pb-10 lg:px-8">
        <Navigation
          activeTab={activeTab}
          onTabChange={navigate}
          deckCount={deck.length}
          dueCount={dueStats.total}
        />

        <div key={activeTab} className="fade-up mt-6 flex-1" role="tabpanel" id={`panel-${activeTab}`}>
          <Suspense fallback={<Fallback />}>
            {activeTab === 'dashboard' && <Dashboard onNavigate={navigate} />}
            {activeTab === 'tracker' && <HabitTracker />}
            {activeTab === 'miner' && <Miner />}
            {activeTab === 'shadowing' && <Shadowing />}
            {activeTab === 'episoden' && <DebatePrep />}
            {activeTab === 'deck' && (
              <Flashcards
                autoReview={deckIntent === 'review'}
                onAutoReviewHandled={() => setDeckIntent(null)}
              />
            )}
          </Suspense>
        </div>
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
