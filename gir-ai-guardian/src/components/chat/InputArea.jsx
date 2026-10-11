import { useState, useRef, useEffect } from 'react';
import {
  SendIcon, PaperclipIcon, MicIcon,
  StopCircleIcon, ZapIcon,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function InputArea() {
  const { sendMessage, isStreaming, abortStream, selectedAgent, error } = useChat();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (prompt) => {
    setText(prompt);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3">
      {/* Error banner */}
      {error && (
        <div className="mb-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400">
          ⚠️ {error}
        </div>
      )}

      {/* Quick action chips */}
      {selectedAgent?.quickPrompts && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {selectedAgent.quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(prompt)}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700
                text-xs text-gray-600 dark:text-gray-400 hover:border-forest-400 hover:text-forest-600
                dark:hover:border-forest-500 dark:hover:text-forest-400 transition-all bg-white dark:bg-gray-900"
            >
              <ZapIcon size={11} className="text-forest-500" />
              <span className="truncate max-w-[200px]">{prompt}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main input row */}
      <div className="flex items-end gap-2">
        {/* Attach button */}
        <button
          className="flex-shrink-0 p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Attach file (coming soon)"
        >
          <PaperclipIcon size={18} />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedAgent?.shortName || 'AI Agent'}… (Enter to send, Shift+Enter for newline)`}
            rows={1}
            className="
              w-full resize-none rounded-2xl border border-gray-200 dark:border-gray-700
              bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100
              px-4 py-3 text-sm leading-relaxed
              focus:outline-none focus:ring-2 focus:ring-forest-400 dark:focus:ring-forest-600 focus:border-transparent
              placeholder:text-gray-400 dark:placeholder:text-gray-600
              transition-all
            "
            style={{ minHeight: '48px', maxHeight: '200px' }}
            disabled={isStreaming}
          />
        </div>

        {/* Voice button (UI only) */}
        <button
          className="flex-shrink-0 p-2.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Voice input (coming soon)"
        >
          <MicIcon size={18} />
        </button>

        {/* Send / Stop button */}
        {isStreaming ? (
          <button
            onClick={abortStream}
            className="flex-shrink-0 p-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm"
            title="Stop generating"
          >
            <StopCircleIcon size={18} />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="flex-shrink-0 p-2.5 rounded-xl bg-forest-600 hover:bg-forest-700 disabled:bg-gray-200
              dark:disabled:bg-gray-800 text-white disabled:text-gray-400 transition-colors shadow-sm"
            title="Send message"
          >
            <SendIcon size={18} />
          </button>
        )}
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
        Gir AI Guardian • Powered by Groq AI • For educational and demonstration purposes
      </p>
    </div>
  );
}
