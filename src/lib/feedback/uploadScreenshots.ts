import { supabase } from '../supabase'

const BUCKET = 'bug-report-screenshots'

export interface UploadScreenshotsResult {
  ok: boolean
  urls: string[]
  error?: string
}

// Uploads bug-report screenshots to the public Supabase bucket using the
// anon client. Returns the public URLs in the same order as the input
// files so the caller can include them in the /api/bug-report payload.
// If any upload fails, returns ok:false along with any URLs that already
// succeeded — the caller can decide whether to retry, drop, or surface
// the partial failure.
export async function uploadScreenshots(files: File[]): Promise<UploadScreenshotsResult> {
  if (files.length === 0) return { ok: true, urls: [] }
  const urls: string[] = []
  for (const file of files) {
    const path = buildPath(file.name)
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false,
    })
    if (error) {
      return {
        ok: false,
        urls,
        error: `Screenshot upload failed (${file.name}): ${error.message}`,
      }
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    urls.push(data.publicUrl)
  }
  return { ok: true, urls }
}

function buildPath(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 10)
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
  return `${timestamp}-${random}-${safeName}`
}
