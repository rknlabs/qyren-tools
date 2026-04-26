import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-void text-fg flex flex-col">
      <header className="border-b border-divider bg-void">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="block">
            <img
              src="/_logos/qyren-logo-transparent-light-2766w.png"
              alt="Qyren"
              className="h-8 w-auto max-w-[160px]"
            />
          </Link>
          <a
            href="https://qyren.ai"
            className="text-sm text-fg/70 hover:text-cyan transition"
          >
            ← qyren.ai
          </a>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-divider px-6 py-6 text-sm text-fg/50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>© 2026 Qyren</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="hover:text-cyan">English</Link>
            <Link to="/tr" className="hover:text-cyan">Türkçe</Link>
            <Link to="/cn" className="hover:text-cyan">简体中文</Link>
            <Link to="/privacy" className="hover:text-cyan">Privacy</Link>
            <Link to="/terms" className="hover:text-cyan">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
