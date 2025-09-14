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
      {/* 🔹 TOS modal is mounted at the very top of the app */}
      <TOSModal />

      <div className="min-h-screen bg-neutral-950 text-neutral-100 p-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
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
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 hover:bg-white/15 active:scale-95 transition"
              onClick={() => setCount((c) => c + 1)}
            >
              count is {count}
            </button>
            <p className="mt-2 text-neutral-300">
              Edit <code className="text-neutral-100/80">src/App.jsx</code> and save to test HMR
            </p>
          </div>

          <p className="mt-6 text-sm text-neutral-400">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      </div>
    </Layout>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="p-4 flex justify-between items-center border-b border-neutral-900 sticky top-0 bg-neutral-950/80 backdrop-blur">
        <h1 className="text-xl font-bold">
          <span className="text-[#DCFC04]">{SITE.name}</span>
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
