import { API_BASE } from './config';

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  programSlug?: string;
  message?: string;
}

/** Submit the public contact form to the backend. Throws on failure. */
export async function submitContact(payload: ContactSubmission): Promise<void> {
  const res = await fetch(`${API_BASE}/api/public/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Contact submit failed');
}
