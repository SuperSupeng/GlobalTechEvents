export interface NewsletterSignupPayload {
  email: string;
  sourcePage: string;
  pageType: string;
}

export interface EventSubmissionPayload {
  name: string;
  email: string;
  eventName: string;
  eventUrl: string;
  sourcePage: string;
  pageType: string;
  notes?: string;
}

async function postJson<TResponse>(url: string, payload: unknown): Promise<TResponse> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.error === 'string'
        ? data.error
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as TResponse;
}

export const submitNewsletterSignup = (payload: NewsletterSignupPayload) =>
  postJson<{ ok: true; duplicate?: boolean }>('/api/newsletter-signups', payload);

export const submitEventSubmission = (payload: EventSubmissionPayload) =>
  postJson<{ ok: true }>('/api/event-submissions', payload);
