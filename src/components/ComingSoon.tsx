import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Bell } from 'lucide-react';

interface ComingSoonProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  isOpen, 
  onClose, 
  feature = 'This feature' 
}) => {
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
          className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          {/* Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all z-20"
          >
            <X size={20} />
          </button>

          <div className="p-12 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <Rocket size={40} className="text-primary" />
            </div>

            {/* Title */}
            <h2 className="text-3xl font-serif italic text-white mb-4 leading-tight">
              Coming Soon
            </h2>

            {/* Description */}
            <p className="text-white/60 mb-8 leading-relaxed text-sm">
              {feature} is currently under development. We're working hard to bring you the best experience!
            </p>

            {/* Email Notification (Optional) */}
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Bell size={18} className="text-accent" />
                <h3 className="text-white font-medium text-sm">Get notified when it's ready</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95">
                  Notify Me
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white text-sm font-medium transition-all"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComingSoon;
