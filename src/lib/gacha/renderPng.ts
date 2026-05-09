import { toPng } from 'html-to-image'

// Renders our own template HTML (escaped field values via renderTemplate.escapeHtml)
// to a PNG by parsing into a Document, mounting body children + head styles into
// an off-screen container, then rasterizing with html-to-image.
export async function renderHtmlToPng(html: string): Promise<Blob> {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const container = document.createElement('div')
  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.top = '0'
  container.style.width = '1080px'
  container.style.background = '#ffffff'

  for (const style of Array.from(doc.head.querySelectorAll('style'))) {
    container.appendChild(style.cloneNode(true))
  }
  for (const child of Array.from(doc.body.children)) {
    container.appendChild(child.cloneNode(true))
  }

  document.body.appendChild(container)
  try {
    const dataUrl = await toPng(container, {
      width: 1080,
      pixelRatio: 1,
      backgroundColor: '#ffffff',
    })
    const res = await fetch(dataUrl)
    return await res.blob()
  } finally {
    document.body.removeChild(container)
  }
}
