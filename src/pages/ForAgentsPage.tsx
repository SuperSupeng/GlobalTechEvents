import React, { useEffect } from 'react';
import {
  AGENT_HANDOFF_DESCRIPTION,
  AGENT_HANDOFF_PROMPT,
  AGENT_HANDOFF_TITLE,
  EVENTS_API_URL,
  FOR_AGENTS_CANONICAL_URL,
  LLMS_TXT_URL,
  agentHandoffChatGptUrl,
  agentHandoffClaudeUrl,
} from '../content/agentHandoff';
import CopyAgentPromptButton from '../components/CopyAgentPromptButton';
import { updateMetaTags } from '../utils/seo';

const ForAgentsPage: React.FC = () => {
  useEffect(() => {
    updateMetaTags({
      title: AGENT_HANDOFF_TITLE,
      description: AGENT_HANDOFF_DESCRIPTION,
      keywords: 'GlobalTechEvents API, event catalog, ChatGPT, Claude, Cursor',
      ogTitle: AGENT_HANDOFF_TITLE,
      ogDescription: AGENT_HANDOFF_DESCRIPTION,
      twitterCard: 'summary',
      canonicalUrl: FOR_AGENTS_CANONICAL_URL,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 pb-20">
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <p className="text-primary-light text-xs uppercase tracking-[0.2em] mb-3">For agents</p>
          <h1 className="text-4xl sm:text-5xl font-serif italic mb-4 leading-tight">
            Copy a prompt for the live event catalog
          </h1>
          <p className="text-white/75 text-lg leading-relaxed">
            Paste this prompt into ChatGPT, Claude, or Cursor. It tells the agent to fetch the live catalog and answer from that JSON only.
          </p>
        </header>

        <section className="glass-panel p-6 sm:p-8 mb-6" aria-label="Copy the agent prompt">
          <h2 className="text-2xl font-serif italic mb-3">Prompt</h2>
          <p className="text-white/70 leading-relaxed mb-5">
            Leave the placeholder, then replace it with your question before you send the prompt.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-5">
            <CopyAgentPromptButton />
            <a
              className="btn-secondary inline-flex items-center justify-center"
              href={agentHandoffChatGptUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in ChatGPT
            </a>
            <a
              className="btn-secondary inline-flex items-center justify-center"
              href={agentHandoffClaudeUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Claude
            </a>
          </div>
          <pre className="whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-black/40 p-4 text-sm leading-relaxed text-white/85 font-mono">
            {AGENT_HANDOFF_PROMPT}
          </pre>
        </section>

        <section className="glass-panel p-6 sm:p-8" aria-label="Public catalog">
          <h2 className="text-2xl font-serif italic mb-3">Public catalog</h2>
          <p className="text-white/80 leading-relaxed mb-4">
            Public. No API key.
          </p>
          <ul className="space-y-3 text-white/80">
            <li>
              <a className="text-primary-light hover:text-white underline underline-offset-4" href={EVENTS_API_URL}>
                {EVENTS_API_URL}
              </a>
            </li>
            <li>
              <a className="text-primary-light hover:text-white underline underline-offset-4" href={LLMS_TXT_URL}>
                /llms.txt
              </a>
              <span className="text-white/55"> — {LLMS_TXT_URL}</span>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ForAgentsPage;
