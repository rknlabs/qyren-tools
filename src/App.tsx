import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Directory } from './routes/Directory'
import { DirectoryTr } from './routes/DirectoryTr'
import { DirectoryCn } from './routes/DirectoryCn'
import { Privacy } from './routes/Privacy'
import { Terms } from './routes/Terms'
import { ToolDetail } from './routes/ToolDetail'
import { NotFound } from './routes/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/tr" element={<DirectoryTr />} />
        <Route path="/cn" element={<DirectoryCn />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/tools/:slug" element={<ToolDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
