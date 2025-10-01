import { useState } from 'react'
import { Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SITE } from './config/site'
import TOSModal from "./components/TOSModal";
function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout>
      <TOSModal />

      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-10">
        <div className="rounded-2xl border border-[var(--color-border)] 
                        bg-[var(--color-surface)] backdrop-blur-md p-6">
          <div className="flex items-center gap-6">
            <a href="https://vite.dev" target="_blank" rel="noreferrer">
              <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="h-16 w-16" alt="React logo" />
            </a>
          </div>

          <h1 className="mt-6 text-3xl font-semibold">Vite + React</h1>

          <div className="mt-4">
            <button
              className="rounded-xl border border-[var(--color-border)] 
                         bg-[var(--color-surface-alt)] 
                         hover:bg-[var(--color-border-strong)] 
                         active:scale-95 transition px-4 py-2"
              onClick={() => setCount((c) => c + 1)}
            >
              count is {count}
            </button>
            <p className="mt-2 text-[var(--color-muted)]">
              Edit <code className="text-[var(--color-heading)]/80">src/App.jsx</code> and save to test HMR
            </p>
          </div>

          <p className="mt-6 text-sm text-[var(--color-muted)]">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>
    </Layout>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="p-4 flex justify-between items-center border-b border-[var(--color-border)] 
                         sticky top-0 bg-[var(--color-surface)]/80 backdrop-blur">
        <h1 className="text-xl font-bold">
          <span className="text-[var(--color-accent-alt)]">{SITE.name}</span>
        </h1>
        <nav className="space-x-4 text-sm">
          <Link to="/?section=news" className="hover:underline">News</Link>
          <Link to="/?section=culture" className="hover:underline">Culture</Link>
          <Link to="/?section=sports" className="hover:underline">Sports</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}


export default App
