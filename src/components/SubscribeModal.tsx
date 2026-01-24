import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Copy, Check, ExternalLink, Rss, Download } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (message: string) => void;
  formatFilter?: string;
  locationFilter?: string;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({
  isOpen,
  onClose,
  onToast,
  formatFilter = 'all',
  locationFilter = 'all',
}) => {
  const [copied, setCopied] = useState(false);

  // 构建订阅 URL
  const buildSubscribeUrl = () => {
    const baseUrl = `${window.location.origin}/api/calendar`;
    const params = new URLSearchParams();
    
    if (formatFilter !== 'all') {
      params.append('format', formatFilter);
    }
    if (locationFilter !== 'all') {
      params.append('location', locationFilter);
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const subscribeUrl = buildSubscribeUrl();

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(subscribeUrl);
      setCopied(true);
      if (onToast) {
        onToast('Calendar URL copied to clipboard!');
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadIcs = () => {
    window.open(subscribeUrl, '_blank');
    if (onToast) {
      onToast('Calendar file downloading...');
    }
  };

  const handleSubscribeApple = () => {
    // 直接下载 .ics 文件，macOS/iOS 会自动用 Apple Calendar 打开
    // 创建一个隐藏的 a 标签来触发下载
    const link = document.createElement('a');
    link.href = subscribeUrl;
    link.download = 'globaltechevents.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onToast) {
      onToast('Calendar file downloaded - open to add to Calendar');
    }
  };

  const handleSubscribeGoogle = async () => {
    // Google Calendar 需要通过 "Add by URL" 功能添加
    // 先复制 URL 到剪贴板，然后打开 Google Calendar 的添加页面
    try {
      await navigator.clipboard.writeText(subscribeUrl);
      // 打开 Google Calendar 的 "Other calendars" 添加页面
      window.open('https://calendar.google.com/calendar/u/0/r/settings/addbyurl', '_blank');
      if (onToast) {
        onToast('URL copied! Paste it in Google Calendar.');
      }
    } catch (err) {
      // 如果复制失败，仍然打开页面
      window.open('https://calendar.google.com/calendar/u/0/r/settings/addbyurl', '_blank');
      if (onToast) {
        onToast('Opening Google Calendar - copy the URL above.');
      }
    }
  };

  const handleSubscribeOutlook = () => {
    // Outlook web subscription - 使用正确的 URL 格式
    const outlookUrl = `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(subscribeUrl)}&name=GlobalTechEvents`;
    window.open(outlookUrl, '_blank');
    if (onToast) {
      onToast('Opening Outlook...');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-[2rem] shadow-2xl overflow-hidden"
        >
          {/* Header Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20"
          >
            <X size={18} />
          </button>

          <div className="p-8 pt-12">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
              <Rss size={28} className="text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              Subscribe to Calendar
            </h2>
            <p className="text-white/60 text-sm mb-8">
              Stay updated with all global tech events. Your calendar will auto-sync when new events are added.
              {(formatFilter !== 'all' || locationFilter !== 'all') && (
                <span className="block mt-2 text-primary-light text-xs">
                  Current filters will be applied to your subscription.
                </span>
              )}
            </p>

            {/* Subscription URL */}
            <div className="mb-8">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2 block">
                Subscription URL
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 font-mono truncate">
                  {subscribeUrl}
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/60 hover:text-white transition-all"
                  title="Copy URL"
                >
                  {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Quick Subscribe Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSubscribeApple}
                className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/80 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-white/60 group-hover:text-white" />
                  <div>
                    <span className="font-medium">Apple Calendar / macOS</span>
                    <span className="block text-xs text-white/40">Downloads .ics, open to add</span>
                  </div>
                </div>
                <Download size={16} className="text-white/40 group-hover:text-white/60" />
              </button>

              <button
                onClick={handleSubscribeGoogle}
                className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/80 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/60 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM12 18.75a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5z"/>
                    <path d="M12 6.75v5.25l3.75 2.25"/>
                  </svg>
                  <div>
                    <span className="font-medium">Google Calendar</span>
                    <span className="block text-xs text-white/40">Copies URL, then paste</span>
                  </div>
                </div>
                <ExternalLink size={16} className="text-white/40 group-hover:text-white/60" />
              </button>

              <button
                onClick={handleSubscribeOutlook}
                className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/80 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-white/60 group-hover:text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.17 2.06A2.16 2.16 0 0019.5 1.5H8.83a2.17 2.17 0 00-2 1.44l-.18.56v.5l.5 14 .18.56a2.17 2.17 0 002 1.44h10.67a2.16 2.16 0 001.67-.56 2.17 2.17 0 00.83-1.44V3.5a2.17 2.17 0 00-.83-1.44zM14 10.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
                  </svg>
                  <span className="font-medium">Outlook</span>
                </div>
                <ExternalLink size={16} className="text-white/40 group-hover:text-white/60" />
              </button>

              <button
                onClick={handleDownloadIcs}
                className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white/80 hover:text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Download size={20} className="text-white/60 group-hover:text-white" />
                  <span className="font-medium">Download .ics file</span>
                </div>
                <span className="text-xs text-white/40">One-time</span>
              </button>
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-[11px] text-white/30 text-center">
              Calendar updates automatically every hour. No account required.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscribeModal;
