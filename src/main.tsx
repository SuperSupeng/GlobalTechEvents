import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
})

// 🎉 开发者彩蛋
if (typeof window !== 'undefined') {
  const styles = {
    title: 'color: #8b5cf6; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(139,92,246,0.3);',
    text: 'color: #a78bfa; font-size: 14px;',
    link: 'color: #c4b5fd; font-size: 16px; font-weight: bold; background: linear-gradient(90deg, #8b5cf6, #a78bfa); padding: 8px 16px; border-radius: 4px;',
    emoji: 'font-size: 20px;'
  };

  console.log('%c🚀 GlobalTechEvents', styles.title);
  console.log('%c👋 嘿，开发者朋友！', styles.text);
  console.log('%c', 'line-height: 20px;'); // 空行
  console.log('%c发现你打开了控制台，看来你也是技术爱好者！', styles.text);
  console.log('%c我们正在构建全球最好的技术活动聚合平台。', styles.text);
  console.log('%c', 'line-height: 20px;'); // 空行
  console.log('%c💬 加入我们的 Discord 社区吧！', styles.link);
  console.log('%chttps://discord.gg/Cj7s7nt7', 'color: #60a5fa; font-size: 14px; text-decoration: underline;');
  console.log('%c', 'line-height: 20px;'); // 空行
  console.log('%c技术栈：React + TypeScript + Vite + Supabase + Three.js', 'color: #6b7280; font-size: 12px; font-style: italic;');
  console.log('%c🌟 如果你有兴趣参与开发或提供反馈，欢迎联系我们！', styles.text);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
