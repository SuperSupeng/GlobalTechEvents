import React, { useState } from 'react';
import { Share2, Twitter, Linkedin, Link, Mail, Check } from 'lucide-react';
import { TechEvent } from '../types';

interface ShareButtonProps {
  event?: TechEvent;
  url?: string;
  title?: string;
  description?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  event, 
  url: customUrl, 
  title: customTitle, 
  description: customDescription 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // 构建分享内容
  const shareUrl = customUrl || (event ? `https://www.globaltechevents.xyz/event/${event.id}` : window.location.href);
  const shareTitle = customTitle || (event ? event.title : 'GlobalTechEvents');
  const shareDescription = customDescription || (event ? event.summary : 'Discover tech events worldwide');

  // Twitter 分享
  const shareToTwitter = () => {
    const text = `${shareTitle}\n\n${shareDescription.substring(0, 200)}...`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}&hashtags=TechEvents,${event?.tags[0] || 'Technology'}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowMenu(false);
  };

  // LinkedIn 分享
  const shareToLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=500');
    setShowMenu(false);
  };

  // 邮件分享
  const shareViaEmail = () => {
    const subject = encodeURIComponent(shareTitle);
    const body = encodeURIComponent(`${shareDescription}\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowMenu(false);
  };

  // 复制链接
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Web Share API（原生分享，移动端）
  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
        setShowMenu(false);
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          // 优先使用原生分享（移动端）
          if (typeof navigator !== 'undefined' && 'share' in navigator) {
            shareNative();
          } else {
            setShowMenu(!showMenu);
          }
        }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
      >
        <Share2 size={18} />
        <span className="text-sm font-medium">Share</span>
      </button>

      {showMenu && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />

          {/* 分享菜单 */}
          <div className="absolute right-0 mt-2 w-56 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 backdrop-blur-xl">
            <button
              onClick={shareToTwitter}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Twitter size={18} />
              <span className="text-sm font-medium">Share on Twitter</span>
            </button>

            <button
              onClick={shareToLinkedIn}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Linkedin size={18} />
              <span className="text-sm font-medium">Share on LinkedIn</span>
            </button>

            <button
              onClick={shareViaEmail}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Mail size={18} />
              <span className="text-sm font-medium">Share via Email</span>
            </button>

            <div className="h-px bg-white/10 my-2" />

            <button
              onClick={copyLink}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Link size={18} />}
              <span className="text-sm font-medium">
                {copied ? 'Link Copied!' : 'Copy Link'}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareButton;
