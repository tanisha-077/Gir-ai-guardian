import { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon, RefreshCwIcon } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AGENTS } from '../../data/agents';

// ── Code block renderer ───────────────────────────────────────
function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-2 rounded-xl overflow-hidden border border-gray-700">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 text-xs text-gray-400">
        <span>{language || 'code'}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 hover:text-gray-100 transition-colors">
          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: '12px' }}
        PreTag="div"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Markdown renderer ─────────────────────────────────────────
function MarkdownContent({ content }) {
  return (
    <div className="prose-chat">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <CodeBlock language={match?.[1]}>{String(children).replace(/\n$/, '')}</CodeBlock>
            ) : (
              <code className={className} {...props}>{children}</code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────
export function TypingIndicator({ agent }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-base
        bg-gradient-to-br from-forest-500 to-emerald-600 shadow-sm">
        {agent?.icon || '🤖'}
      </div>
      <div className="flex flex-col gap-1 max-w-xl">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{agent?.name || 'AI Agent'}</span>
        <div className="message-ai flex items-center gap-1 py-3">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

// ── Streaming message (partial) ───────────────────────────────
export function StreamingMessage({ text, agent }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-base
        bg-gradient-to-br from-forest-500 to-emerald-600 shadow-sm">
        {agent?.icon || '🤖'}
      </div>
      <div className="flex flex-col gap-1 max-w-3xl flex-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{agent?.name || 'AI Agent'}</span>
        <div className="message-ai">
          <MarkdownContent content={text + '▍'} />
        </div>
      </div>
    </div>
  );
}

// ── Main message item ─────────────────────────────────────────
export default function MessageItem({ message, onRegenerate, isLast }) {
  const [copied, setCopied] = useState(false);
  const agent = AGENTS.find(a => a.id === message.agentId);
  const isUser = message.role === 'user';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [message.content]);

  if (isUser) {
    return (
      <div className="flex justify-end gap-2 animate-fade-in group">
        <div className="flex flex-col items-end gap-1 max-w-2xl">
          <div className="message-user">
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-gray-400">
              {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : ''}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Copy message"
            >
              {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
            </button>
          </div>
        </div>
        {/* User avatar */}
        <div className="w-8 h-8 rounded-xl flex-shrink-0 bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          U
        </div>
      </div>
    );
  }

  // AI message
  return (
    <div className="flex gap-3 animate-fade-in group">
      {/* Agent avatar */}
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-base
        bg-gradient-to-br from-forest-500 to-emerald-600 shadow-sm">
        {agent?.icon || '🤖'}
      </div>
      <div className="flex flex-col gap-1 max-w-3xl flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {agent?.name || 'AI Agent'}
          </span>
          <span className="text-xs text-gray-400">
            {message.timestamp ? format(new Date(message.timestamp), 'HH:mm') : ''}
          </span>
        </div>
        <div className="message-ai">
          <MarkdownContent content={message.content} />
        </div>
        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 p-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            title="Copy response"
          >
            {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {isLast && onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 p-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title="Regenerate response"
            >
              <RefreshCwIcon size={12} />
              Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
