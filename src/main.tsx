import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { Home } from './modes/Home'
import { InboxFire } from './modes/InboxFire'
import { RedPen } from './modes/RedPen'
import { FirstPrinciples } from './modes/FirstPrinciples'
import { TheRoom } from './modes/TheRoom'
import { LiveSession } from './modes/LiveSession'
import { Progress } from './modes/Progress'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="inbox-fire" element={<InboxFire />} />
          <Route path="red-pen" element={<RedPen />} />
          <Route path="first-principles" element={<FirstPrinciples />} />
          <Route path="the-room" element={<TheRoom />} />
          <Route path="live" element={<LiveSession />} />
          <Route path="progress" element={<Progress />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
