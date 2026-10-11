import { useState, useEffect } from 'react';
import { ChatProvider } from './context/ChatContext';
import { useTheme } from './hooks/useTheme';
import { checkHealth } from './services/api';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import ChatPage from './pages/ChatPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';

function AppShell() {
  const { isDark, toggle } = useTheme();
  const [currentPage, setCurrentPage]       = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isConnected, setIsConnected]       = useState(false);

  // Check backend connectivity on mount and every 30s
  useEffect(() => {
    const check = async () => {
      try {
        const ok = await checkHealth();
        setIsConnected(ok);
      } catch {
        setIsConnected(false);
      }
    };
    check();
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'settings':  return <SettingsPage />;
      default:          return <ChatPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: isDark ? '#030712' : '#ffffff' }}>
      {/* Sidebar */}
      <Sidebar
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          isDark={isDark}
          onToggleTheme={toggle}
          isConnected={isConnected}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <AppShell />
    </ChatProvider>
  );
}
