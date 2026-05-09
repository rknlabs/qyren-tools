export async function sha256(input: string): Promise<string> {
  return digestHex(new TextEncoder().encode(input))
}

export async function sha256Bytes(bytes: ArrayBuffer | Uint8Array): Promise<string> {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  return digestHex(view)
}

async function digestHex(view: Uint8Array): Promise<string> {
  // Copy into a fresh ArrayBuffer to satisfy crypto.subtle.digest's strict
  // BufferSource typing (which excludes SharedArrayBuffer-backed views).
  const buf = new ArrayBuffer(view.byteLength)
  new Uint8Array(buf).set(view)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function canonicalizeJson(value: unknown): string {
  return JSON.stringify(value, replacer)
}

function replacer(_key: string, value: unknown): unknown {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const sorted: Record<string, unknown> = {}
    for (const k of Object.keys(value as Record<string, unknown>).sort()) {
      sorted[k] = (value as Record<string, unknown>)[k]
    }
    return sorted
  }
  return value
}
