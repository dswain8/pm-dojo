import { Outlet, Link, useLocation } from 'react-router-dom'

export default function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-dojo-border px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-2xl">&#x1F94B;</span>
          <span className="text-lg font-bold tracking-widest uppercase text-dojo-accent">
            PM Dojo
          </span>
        </Link>
        <div className="flex gap-4">
          {!isHome && (
            <Link to="/" className="text-dojo-muted hover:text-dojo-text text-sm transition-colors">
              Arena
            </Link>
          )}
          <Link to="/progress" className="text-dojo-muted hover:text-dojo-text text-sm transition-colors">
            Progress
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
