import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { proofSentenceFromBody, type ProofSentence } from '../data/calendarDownloads';

interface CalendarDownloadProofProps {
  readonly className: string;
}

const CalendarDownloadProof: React.FC<CalendarDownloadProofProps> = ({ className }) => {
  const { data: sentence } = useQuery({
    queryKey: ['calendar-downloads'],
    queryFn: fetchProofSentence,
  });

  if (!sentence) return null;

  return (
    <p className={className}>
      {sentence.map((part, index) =>
        typeof part === 'string' ? (
          part
        ) : (
          <span key={index} className="font-medium text-white/90 tabular-nums">
            {part.figure}
          </span>
        ),
      )}
    </p>
  );
};

// A 503 body parses to null. Throwing would make React Query retry a deliberate hide.
async function fetchProofSentence({ signal }: { signal: AbortSignal }): Promise<ProofSentence | null> {
  const response = await fetch('/api/followers', { signal });
  return proofSentenceFromBody(await response.json());
}

export default CalendarDownloadProof;
