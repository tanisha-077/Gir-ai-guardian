import MessageItem, { TypingIndicator, StreamingMessage } from './MessageItem';
import { useAutoScroll } from '../../hooks/useAutoScroll';
import { useChat } from '../../context/ChatContext';

export default function MessageList() {
  const { messages, isStreaming, streamingText, selectedAgent, regenerate } = useChat();
  const scrollRef = useAutoScroll([messages.length, streamingText]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
    >
      {messages.map((msg, idx) => (
        <MessageItem
          key={msg.id}
          message={msg}
          isLast={idx === messages.length - 1}
          onRegenerate={idx === messages.length - 1 && msg.role === 'assistant' ? regenerate : null}
        />
      ))}

      {/* Streaming: show partial response or typing indicator */}
      {isStreaming && (
        streamingText
          ? <StreamingMessage text={streamingText} agent={selectedAgent} />
          : <TypingIndicator agent={selectedAgent} />
      )}
    </div>
  );
}
