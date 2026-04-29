import { Link } from 'react-router-dom'
import { useEffect, useState, type ReactNode } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { CaptureForm } from './CaptureForm'

interface LayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

export function Layout({ children, sidebar }: LayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!drawerOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col">
      <header className="sticky top-0 z-20 border-b border-divider bg-bg/90 backdrop-blur">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {sidebar && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open navigation"
                className="lg:hidden inline-flex items-center justify-center size-9 rounded-md text-fg-muted hover:text-fg hover:bg-surface transition"
              >
                <Menu size={20} />
              </button>
            )}
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
          </div>
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
        {sidebar && (
          <aside className="hidden lg:block shrink-0 border-r border-divider bg-bg sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
            {sidebar}
          </aside>
        )}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {sidebar && drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-y-0 left-0 z-40 lg:hidden bg-bg border-r border-divider overflow-y-auto"
            role="dialog"
            aria-label="Navigation"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('button')) closeDrawer()
            }}
          >
            <div className="flex justify-end p-2">
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation"
                className="inline-flex items-center justify-center size-9 rounded-md text-fg-muted hover:text-fg hover:bg-surface transition"
              >
                <X size={20} />
              </button>
            </div>
            {sidebar}
          </aside>
        </>
      )}

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
