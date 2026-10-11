import { SunIcon, MoonIcon, WifiIcon, WifiOffIcon, LayoutDashboardIcon, MessageSquareIcon } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function Header({ isDark, onToggleTheme, isConnected, currentPage, onNavigate }) {
  const { selectedAgent } = useChat();

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm flex-shrink-0 z-10">
      {/* Left: Logo + breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            G
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
              Gir AI Guardian
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mt-0.5">
              Human-Wildlife Conflict Mitigation
            </p>
          </div>
        </div>

        {/* Page tabs */}
        <div className="hidden md:flex items-center gap-1 ml-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => onNavigate('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPage === 'chat'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MessageSquareIcon size={13} />
            Chat
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              currentPage === 'dashboard'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <LayoutDashboardIcon size={13} />
            Dashboard
          </button>
        </div>
      </div>

      {/* Center: Active agent indicator */}
      <div className="flex items-center">
        {currentPage === 'chat' && (
          <div className={`agent-badge ${selectedAgent.badgeClass}`}>
            <span>{selectedAgent.icon}</span>
            <span className="hidden sm:inline">{selectedAgent.shortName}</span>
          </div>
        )}
        {currentPage === 'dashboard' && (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Analytics Dashboard</span>
        )}
      </div>

      {/* Right: Status + Theme toggle */}
      <div className="flex items-center gap-2">
        {/* Connection status */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isConnected
            ? 'bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400'
            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
        }`}>
          {isConnected
            ? <><span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
                <span className="hidden sm:inline">Connected</span></>
            : <><WifiOffIcon size={12} /><span className="hidden sm:inline">Offline</span></>
          }
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>
    </header>
  );
}
