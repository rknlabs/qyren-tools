import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        {children}
      </main>
      <footer className="border-t border-zinc-900 px-6 py-6 text-sm text-zinc-500">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>© 2026 Qyren</div>
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="hover:text-zinc-300">English</Link>
            <Link to="/tr" className="hover:text-zinc-300">Türkçe</Link>
            <Link to="/cn" className="hover:text-zinc-300">简体中文</Link>
            <Link to="/privacy" className="hover:text-zinc-300">Privacy</Link>
            <Link to="/terms" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
