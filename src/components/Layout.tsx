import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ThemeToggle } from './ThemeToggle'
import { CaptureForm } from './CaptureForm'

interface LayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function Layout({ children, sidebar }: LayoutProps) {
  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <header className="sticky top-0 z-20 border-b border-divider bg-bg/90 backdrop-blur">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="block shrink-0">
            <img
              src="/_logos/qyren-logo-transparent-dark-2766w.png"
              alt="Qyren"
              className="h-11 w-auto logo-light"
            />
            <img
              src="/_logos/qyren-logo-transparent-light-2766w.png"
              alt="Qyren"
              className="h-11 w-auto logo-dark"
            />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href="https://qyren.ai"
              className="text-sm text-fg-muted hover:text-cyan transition"
            >
              qyren.ai →
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebar}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <footer className="border-t border-divider px-6 py-8 text-sm text-fg-muted">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <CaptureForm variant="compact" />
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-divider">
            <div>© 2026 Qyren</div>
            <div className="flex flex-wrap gap-4">
              <Link to="/" className="hover:text-cyan">English</Link>
              <Link to="/tr" className="hover:text-cyan">Türkçe</Link>
              <Link to="/cn" className="hover:text-cyan">简体中文</Link>
              <Link to="/privacy" className="hover:text-cyan">Privacy</Link>
              <Link to="/terms" className="hover:text-cyan">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
