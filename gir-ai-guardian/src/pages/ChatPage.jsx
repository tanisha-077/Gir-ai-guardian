import { useChat } from '../context/ChatContext';
import MessageList from '../components/chat/MessageList';
import InputArea from '../components/chat/InputArea';
import { AGENTS } from '../data/agents';

// ── Landing / welcome screen ──────────────────────────────────
function WelcomeScreen({ onAgentSelect }) {
  const { selectedAgent } = useChat();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
      {/* Hero */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-forest-500 to-emerald-700 flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg">
          🦁
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Gir AI Guardian
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
          Protecting communities and wildlife through intelligent prediction,
          early warning, and coordinated response.
        </p>
        <p className="mt-3 text-sm font-medium text-forest-600 dark:text-forest-400">
          Select an AI agent to begin
        </p>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">
        {AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => onAgentSelect(agent)}
            className={`
              glass-card p-5 text-left hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
              hover:shadow-md cursor-pointer
              ${selectedAgent.id === agent.id ? 'ring-2 ring-forest-500 ring-offset-2 dark:ring-offset-gray-950' : ''}
            `}
          >
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl mb-3 shadow-sm`}>
              {agent.icon}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-sm">
              {agent.name} Agent
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {agent.description}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${agent.dotClass}`} />
              <span className="text-xs text-gray-400 dark:text-gray-500">Active</span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick start tip */}
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-600 text-center">
        💡 Tip: Use quick action chips below the chat input for suggested prompts
      </p>
    </div>
  );
}

// ── Chat page ─────────────────────────────────────────────────
export default function ChatPage() {
  const { messages, createNewChat, switchAgent } = useChat();
  const hasMessages = messages.length > 0;

  const handleAgentSelect = (agent) => {
    switchAgent(agent);
    createNewChat(agent.id);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {hasMessages ? (
        <MessageList />
      ) : (
        <WelcomeScreen onAgentSelect={handleAgentSelect} />
      )}
      <InputArea />
    </div>
  );
}
