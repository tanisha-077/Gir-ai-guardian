import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { streamChat, saveSession, deleteSession } from '../services/api';
import { AGENTS } from '../data/agents';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  // Active session state
  const [sessions, setSessions]           = useState([]);     // list of sessions
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages]           = useState([]);     // messages in active session
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [isStreaming, setIsStreaming]      = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError]                 = useState(null);

  const abortRef = useRef(null); // holds AbortController for current stream

  // ── Create a new session ──────────────────────────────────────
  const createNewChat = useCallback((agentId) => {
    const id = uuidv4();
    const agent = AGENTS.find(a => a.id === agentId) || selectedAgent;
    const session = {
      id,
      title: 'New Chat',
      agentId: agent.id,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions(prev => [session, ...prev]);
    setActiveSessionId(id);
    setMessages([]);
    setSelectedAgent(agent);
    setError(null);
    return id;
  }, [selectedAgent]);

  // ── Load an existing session ──────────────────────────────────
  const loadSession = useCallback((session) => {
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    const agent = AGENTS.find(a => a.id === session.agentId) || AGENTS[0];
    setSelectedAgent(agent);
    setError(null);
  }, []);

  // ── Remove a session ──────────────────────────────────────────
  const removeSession = useCallback(async (id) => {
    try { await deleteSession(id); } catch { /* ok if server call fails */ }
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setMessages([]);
    }
  }, [activeSessionId]);

  // ── Switch agent (and optionally start fresh) ─────────────────
  const switchAgent = useCallback((agent) => {
    setSelectedAgent(agent);
  }, []);

  // ── Send a message ────────────────────────────────────────────
  const sendMessage = useCallback(async (content) => {
    if (isStreaming) return;
    setError(null);

    // Ensure there's an active session
    let sessionId = activeSessionId;
    if (!sessionId) {
      sessionId = createNewChat(selectedAgent.id);
    }

    // Build user message
    const userMsg = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      agentId: selectedAgent.id,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setStreamingText('');

    // Persist session with new user message
    const sessionTitle = messages.length === 0
      ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
      : undefined;

    // Format messages for API (only role + content needed)
    const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }));

    let accumulated = '';

    abortRef.current = streamChat(
      { messages: apiMessages, agentId: selectedAgent.id, sessionId },
      // onDelta
      (delta) => {
        accumulated += delta;
        setStreamingText(prev => prev + delta);
      },
      // onDone
      async () => {
        const aiMsg = {
          id: uuidv4(),
          role: 'assistant',
          content: accumulated,
          timestamp: new Date().toISOString(),
          agentId: selectedAgent.id,
        };
        const finalMessages = [...updatedMessages, aiMsg];
        setMessages(finalMessages);
        setIsStreaming(false);
        setStreamingText('');

        // Save to backend
        const title = sessionTitle || sessions.find(s => s.id === sessionId)?.title || 'Chat';
        const updated = {
          id: sessionId,
          title,
          agentId: selectedAgent.id,
          messages: finalMessages,
        };
        setSessions(prev => {
          const exists = prev.find(s => s.id === sessionId);
          if (exists) return prev.map(s => s.id === sessionId ? { ...s, ...updated } : s);
          return [updated, ...prev];
        });
        try { await saveSession(updated); } catch { /* non-critical */ }
      },
      // onError
      (errMsg) => {
        setError(errMsg);
        setIsStreaming(false);
        setStreamingText('');
      }
    );
  }, [isStreaming, activeSessionId, messages, selectedAgent, sessions, createNewChat]);

  // ── Abort current stream ──────────────────────────────────────
  const abortStream = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingText('');
  }, []);

  // ── Regenerate last response ──────────────────────────────────
  const regenerate = useCallback(() => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    // Remove last AI message and re-send
    const trimmed = messages.filter(m => m.id !== messages[messages.length - 1]?.id);
    setMessages(trimmed.filter(m => m.role !== 'assistant' || trimmed.indexOf(m) < trimmed.length - 1));
    sendMessage(lastUser.content);
  }, [messages, sendMessage]);

  return (
    <ChatContext.Provider value={{
      sessions,
      activeSessionId,
      messages,
      selectedAgent,
      isStreaming,
      streamingText,
      error,
      createNewChat,
      loadSession,
      removeSession,
      switchAgent,
      sendMessage,
      abortStream,
      regenerate,
      setError,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
