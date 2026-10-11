// API service layer — all backend communication goes through here

const BASE_URL = '/api';

/**
 * Send a chat message and stream the response via callback.
 * @param {Object} params - { messages, agentId, sessionId }
 * @param {Function} onDelta - called with each text chunk
 * @param {Function} onDone - called when stream completes
 * @param {Function} onError - called on error
 * @returns {AbortController} – call .abort() to cancel the stream
 */
export function streamChat({ messages, agentId, sessionId }, onDelta, onDone, onError) {
  const controller = new AbortController();

  fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, agentId, sessionId }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Network error' }));
        onError(err.error || 'Request failed');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'delta') onDelta(data.content);
            else if (data.type === 'done') onDone(data.sessionId);
            else if (data.type === 'error') onError(data.message);
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err.message || 'Stream error');
    });

  return controller;
}

/** Fetch all chat sessions (history list) */
export async function fetchHistory() {
  const res = await fetch(`${BASE_URL}/history`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

/** Fetch a single session by id */
export async function fetchSession(id) {
  const res = await fetch(`${BASE_URL}/history/${id}`);
  if (!res.ok) throw new Error('Session not found');
  return res.json();
}

/** Save / create a chat session */
export async function saveSession(session) {
  const res = await fetch(`${BASE_URL}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(session),
  });
  if (!res.ok) throw new Error('Failed to save session');
  return res.json();
}

/** Delete a session by id */
export async function deleteSession(id) {
  const res = await fetch(`${BASE_URL}/history/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete session');
  return res.json();
}

/** Health check */
export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.ok;
}
