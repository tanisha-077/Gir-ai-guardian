import { useTheme } from '../hooks/useTheme';
import { AGENTS } from '../data/agents';

export default function SettingsPage() {
  const { isDark, toggle } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h2>

      {/* Appearance */}
      <div className="glass-card p-5 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Appearance</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark theme</p>
          </div>
          <button
            onClick={toggle}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${isDark ? 'bg-forest-600' : 'bg-gray-300'}`}
          >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform mt-0.5 ${isDark ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* AI Agents info */}
      <div className="glass-card p-5 mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">AI Agents</h3>
        <div className="space-y-3">
          {AGENTS.map(agent => (
            <div key={agent.id} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {agent.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{agent.name} Agent</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{agent.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">About</h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p><span className="font-medium text-gray-800 dark:text-gray-200">Application:</span> Gir AI Guardian</p>
          <p><span className="font-medium text-gray-800 dark:text-gray-200">Version:</span> 1.0.0</p>
          <p><span className="font-medium text-gray-800 dark:text-gray-200">AI Provider:</span> Groq (LLaMA 3.3 70B)</p>
          <p><span className="font-medium text-gray-800 dark:text-gray-200">Purpose:</span> Human-Wildlife Conflict Mitigation for Gir Forest Region</p>
          <p><span className="font-medium text-gray-800 dark:text-gray-200">Tech Stack:</span> React + Vite, Tailwind CSS, Node.js + Express, Groq API</p>
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-700">
            This application is built for educational and demonstration purposes as part of an AI hackathon.
          </p>
        </div>
      </div>
    </div>
  );
}
