import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import App from './App.tsx'
import './index.css'
import { WHATSAPP_GROUP_URL } from './config/constants'
import AnalyticsScripts from './components/AnalyticsScripts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

if (typeof window !== 'undefined') {
  const styles = {
    title: 'color: #8b5cf6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(139,92,246,0.3);',
    text: 'color: #a78bfa; font-size: 14px;',
    link: 'color: #c4b5fd; font-size: 16px; font-weight: bold; background: linear-gradient(90deg, #8b5cf6, #a78bfa); padding: 8px 16px; border-radius: 4px;',
  }

  console.log('%c🚀 GlobalTechEvents', styles.title)
  console.log('%c👋 Hey, developer!', styles.text)
  console.log('%c', 'line-height: 20px;')
  console.log('%cYou opened the console—looks like you\'re a tech enthusiast too!', styles.text)
  console.log('%cWe\'re building the world\'s best tech events aggregator.', styles.text)
  console.log('%c', 'line-height: 20px;')
  console.log('%c💬 Join our WhatsApp community!', styles.link)
  console.log(`%c${WHATSAPP_GROUP_URL}`, 'color: #60a5fa; font-size: 14px; text-decoration: underline;')
  console.log('%c', 'line-height: 20px;')
  console.log('%cStack: React + TypeScript + Vite + Supabase + Three.js', 'color: #6b7280; font-size: 12px; font-style: italic;')
  console.log('%c🌟 Interested in contributing or feedback? We\'d love to hear from you!', styles.text)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AnalyticsScripts />
      <App />
      <Analytics />
    </QueryClientProvider>
  </React.StrictMode>,
)
