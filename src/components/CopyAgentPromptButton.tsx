import React, { useState } from 'react';
import { copyAgentHandoffPrompt } from '../content/agentHandoff';

interface CopyAgentPromptButtonProps {
  className?: string;
}

const CopyAgentPromptButton: React.FC<CopyAgentPromptButtonProps> = ({ className }) => {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const onCopy = async () => {
    try {
      await copyAgentHandoffPrompt();
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <button type="button" onClick={onCopy} className={className ?? 'btn-primary inline-flex items-center justify-center'}>
        Copy prompt
      </button>
      <span role="status" className="text-sm text-white/70">
        {status === 'copied' ? 'Copied' : status === 'failed' ? 'Select the prompt and copy it manually.' : ''}
      </span>
    </span>
  );
};

export default CopyAgentPromptButton;
