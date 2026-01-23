import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="24" cy="24" r="20" stroke="url(#gradient1)" strokeWidth="2.5" fill="none"/>
      <ellipse cx="24" cy="24" rx="20" ry="8" stroke="url(#gradient1)" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <ellipse cx="24" cy="24" rx="8" ry="20" stroke="url(#gradient1)" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path 
        d="M28 20L20 28L23 28L20 36L28 26L25 26L28 20Z" 
        fill="url(#gradient2)" 
        stroke="url(#gradient2)" 
        strokeWidth="1" 
        strokeLinejoin="round"
      />
      <circle cx="38" cy="16" r="2" fill="url(#gradient2)"/>
      <circle cx="42" cy="28" r="2" fill="url(#gradient2)"/>
      <circle cx="10" cy="14" r="2" fill="url(#gradient2)"/>
      <circle cx="6" cy="30" r="2" fill="url(#gradient2)"/>
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ff7a18', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#ffd8a8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f2e7ff', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffd8a8', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff7a18', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
