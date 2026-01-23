import { TechEvent } from '../types';

export interface EventTag {
  label: string;
  icon: string;
  color: string;
  category: 'type' | 'price' | 'tech' | 'format';
}

// 从活动信息中智能识别标签
export const identifyTags = (event: TechEvent): EventTag[] => {
  const tags: EventTag[] = [];
  
  // 活动类型识别（基于标题和描述）
  const title = event.title.toLowerCase();
  const summary = event.summary.toLowerCase();
  const fullText = `${title} ${summary}`;
  
  // 活动类型
  if (fullText.includes('conference') || fullText.includes('conf ')) {
    tags.push({ label: 'Conference', icon: '🎤', color: 'blue', category: 'type' });
  } else if (fullText.includes('workshop')) {
    tags.push({ label: 'Workshop', icon: '🛠️', color: 'purple', category: 'type' });
  } else if (fullText.includes('meetup')) {
    tags.push({ label: 'Meetup', icon: '👥', color: 'green', category: 'type' });
  } else if (fullText.includes('webinar') || fullText.includes('online')) {
    tags.push({ label: 'Webinar', icon: '💻', color: 'cyan', category: 'type' });
  } else if (fullText.includes('hackathon')) {
    tags.push({ label: 'Hackathon', icon: '🏆', color: 'yellow', category: 'type' });
  } else if (fullText.includes('summit')) {
    tags.push({ label: 'Summit', icon: '⛰️', color: 'indigo', category: 'type' });
  }
  
  // 价格标签
  if (event.price.type === 'free') {
    tags.push({ label: 'Free', icon: '💰', color: 'emerald', category: 'price' });
  } else if (event.price.type === 'paid') {
    tags.push({ label: 'Paid', icon: '💳', color: 'orange', category: 'price' });
  }
  
  // 技术领域标签（基于 tags 字段）
  const eventTags = event.tags.map(t => t.toLowerCase());
  
  if (eventTags.some(t => ['ai', 'ml', 'machine learning', 'deep learning'].includes(t))) {
    tags.push({ label: 'AI/ML', icon: '🤖', color: 'purple', category: 'tech' });
  }
  if (eventTags.some(t => ['web3', 'blockchain', 'crypto'].includes(t))) {
    tags.push({ label: 'Web3', icon: '⛓️', color: 'indigo', category: 'tech' });
  }
  if (eventTags.some(t => ['react', 'vue', 'angular', 'frontend'].includes(t))) {
    tags.push({ label: 'Frontend', icon: '⚛️', color: 'cyan', category: 'tech' });
  }
  if (eventTags.some(t => ['devops', 'kubernetes', 'docker', 'cloud'].includes(t))) {
    tags.push({ label: 'DevOps', icon: '☁️', color: 'blue', category: 'tech' });
  }
  if (eventTags.some(t => ['javascript', 'typescript', 'js', 'ts'].includes(t))) {
    tags.push({ label: 'JavaScript', icon: '🟨', color: 'yellow', category: 'tech' });
  }
  
  // 格式标签
  if (event.format === 'online') {
    tags.push({ label: 'Online', icon: '🌐', color: 'emerald', category: 'format' });
  } else if (event.format === 'hybrid') {
    tags.push({ label: 'Hybrid', icon: '🔄', color: 'purple', category: 'format' });
  }
  
  return tags;
};

// 获取标签颜色类
export const getTagColorClasses = (color: string): { bg: string; border: string; text: string } => {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  };
  
  return colorMap[color] || { bg: 'bg-white/5', border: 'border-white/10', text: 'text-white/60' };
};
