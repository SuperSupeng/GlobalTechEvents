export const EVENTS_API_URL = 'https://www.globaltechevents.xyz/api/events';
export const LLMS_TXT_URL = 'https://www.globaltechevents.xyz/llms.txt';
export const FOR_AGENTS_PATH = '/for-agents';
export const FOR_AGENTS_CANONICAL_URL = 'https://www.globaltechevents.xyz/for-agents';

export const AGENT_HANDOFF_TITLE = 'Copy a prompt for the live event catalog | GlobalTechEvents';
export const AGENT_HANDOFF_DESCRIPTION =
  'Copy a prompt for ChatGPT, Claude, or Cursor that fetches the public GlobalTechEvents catalog. No API key.';

/**
 * Paste prompt. Keep the placeholder. Do not paraphrase.
 */
export const AGENT_HANDOFF_PROMPT = `Fetch the latest GlobalTechEvents catalog now (do not use training memory or cached pages).

1) GET https://www.globaltechevents.xyz/api/events
2) Parse the JSON: { "events": [ { "name", "dates": { "start", "end" }, "city", "url", "slug" } ] }
   - dates are YYYY-MM-DD
   - url is the organizer site when listed, otherwise the guide on globaltechevents.xyz
3) Optional orientation: https://www.globaltechevents.xyz/llms.txt

Then answer my question using only that live catalog. Sort by dates.start. If something is missing from the JSON, say so — do not invent events. Confirm registration on each event’s url.

My question: <what I’m looking for — e.g. “AI / cloud events in Europe after Oct 2026”>`;

export function agentHandoffChatGptUrl(prompt: string = AGENT_HANDOFF_PROMPT): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
}

export function agentHandoffClaudeUrl(prompt: string = AGENT_HANDOFF_PROMPT): string {
  return `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
}

export async function copyAgentHandoffPrompt(prompt: string = AGENT_HANDOFF_PROMPT): Promise<void> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText && window.isSecureContext) {
    await navigator.clipboard.writeText(prompt);
    return;
  }

  const area = document.createElement('textarea');
  area.value = prompt;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand('copy');
  document.body.removeChild(area);
  if (!ok) {
    throw new Error('Copy failed');
  }
}
