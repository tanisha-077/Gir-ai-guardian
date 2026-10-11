import { useState } from 'react';
import {
  PlusIcon, ChevronDownIcon, TrashIcon,
  LayoutDashboardIcon, MessageSquareIcon,
  SettingsIcon, ChevronLeftIcon, ChevronRightIcon,
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { AGENTS } from '../../data/agents';
import { formatDistanceToNow } from 'date-fns';

export default function Sidebar({ onNavigate, currentPage, collapsed, onToggle }) {
  const {
    sessions, activeSessionId, selectedAgent,
    createNewChat, loadSession, removeSession, switchAgent,
  } = useChat();

  const [agentsOpen, setAgentsOpen] = useState(true);

  const handleNewChat = () => {
    createNewChat(selectedAgent.id);
    onNavigate('chat');
  };

  const handleAgentSelect = (agent) => {
    switchAgent(agent);
    createNewChat(agent.id);
    onNavigate('chat');
  };

  const handleSessionClick = (session) => {
    loadSession(session);
    onNavigate('chat');
  };

  return (
    <aside
      className={`
        flex flex-col h-full bg-gray-50 dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-800
        transition-all duration-300 ease-in-out flex-shrink-0
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Top: Logo + collapse toggle */}
      <div className="flex items-center justify-between h-14 px-3 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">🦁</span>
            <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">Gir AI Guardian</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon size={16} /> : <ChevronLeftIcon size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* New Chat */}
        <button
          onClick={handleNewChat}
          className={`
            w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium
            bg-forest-600 hover:bg-forest-700 text-white transition-colors
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <PlusIcon size={16} className="flex-shrink-0" />
          {!collapsed && <span>New Chat</span>}
        </button>

        {/* Dashboard button */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`sidebar-item w-full ${currentPage === 'dashboard' ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
        >
          <LayoutDashboardIcon size={16} className="flex-shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </button>

        {/* Agent Selection */}
        {!collapsed && (
          <div className="mt-3">
            <button
              onClick={() => setAgentsOpen(o => !o)}
              className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hover:text-gray-700 dark:hover:text-gray-300"
            >
              <span>AI Agents</span>
              <ChevronDownIcon
                size={14}
                className={`transition-transform ${agentsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {agentsOpen && (
              <div className="mt-1 space-y-0.5">
                {AGENTS.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => handleAgentSelect(agent)}
                    className={`sidebar-item w-full text-left ${selectedAgent.id === agent.id ? 'active' : ''}`}
                  >
                    <span className="text-base">{agent.icon}</span>
                    <span className="truncate text-xs">{agent.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsed agent icons */}
        {collapsed && (
          <div className="mt-2 space-y-1">
            {AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => handleAgentSelect(agent)}
                title={agent.name}
                className={`sidebar-item w-full justify-center ${selectedAgent.id === agent.id ? 'active' : ''}`}
              >
                <span className="text-base">{agent.icon}</span>
              </button>
            ))}
          </div>
        )}

        {/* Chat History */}
        {!collapsed && sessions.length > 0 && (
          <div className="mt-4">
            <p className="px-3 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Recent Chats
            </p>
            <div className="space-y-0.5 mt-1">
              {sessions.map(session => {
                const agent = AGENTS.find(a => a.id === session.agentId);
                return (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all
                      ${activeSessionId === session.id
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    onClick={() => handleSessionClick(session)}
                  >
                    <span className="text-sm flex-shrink-0">{agent?.icon || '💬'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {formatDistanceToNow(new Date(session.updatedAt || session.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeSession(session.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-red-500 transition-all"
                    >
                      <TrashIcon size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Settings */}
      <div className="p-2 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => onNavigate('settings')}
          className={`sidebar-item w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <SettingsIcon size={16} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
