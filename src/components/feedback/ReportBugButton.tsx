import { useState } from 'react'
import { Bug } from 'lucide-react'
import { ReportBugModal } from './ReportBugModal'
import type { BugReportSubmission, SubmitResult } from './types'

interface ReportBugButtonProps {
  // Submit handler injected by the page so the same modal can ship the
  // stub in commit 2 and the real /api/bug-report call in commit 3 without
  // the modal having to know which.
  onSubmit: (input: BugReportSubmission) => Promise<SubmitResult>
  label?: string
}

export function ReportBugButton({
  onSubmit,
  label = 'Report a bug',
}: ReportBugButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-cyan transition"
      >
        <Bug size={12} />
        {label}
      </button>
      {open && (
        <ReportBugModal onClose={() => setOpen(false)} onSubmit={onSubmit} />
      )}
    </>
  )
}
