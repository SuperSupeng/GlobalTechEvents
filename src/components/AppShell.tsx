import React from 'react';
import Navbar from './Navbar';

interface AppShellProps {
  children: React.ReactNode;
  background?: React.ReactNode;
  onExploreClick: () => void;
  onResourcesClick: () => void;
  onSubmitClick: () => void;
  onEventsHubClick: () => void;
  onGuidesClick: () => void;
}

const AppShell: React.FC<AppShellProps> = ({
  children,
  background,
  onExploreClick,
  onResourcesClick,
  onSubmitClick,
  onEventsHubClick,
  onGuidesClick,
}) => {
  return (
    <div className="relative flex h-dvh min-h-0 flex-col overflow-hidden">
      {background}
      <Navbar
        onExploreClick={onExploreClick}
        onResourcesClick={onResourcesClick}
        onSubmitClick={onSubmitClick}
        onEventsHubClick={onEventsHubClick}
        onGuidesClick={onGuidesClick}
      />
      <div id="app-scroll" className="relative z-10 min-h-0 flex-1 overflow-y-auto scroll-pt-4">
        {children}
      </div>
    </div>
  );
};

export default AppShell;
