import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-react';
import {
  STATS, WEEKLY_INCIDENTS, MONTHLY_SIGHTINGS,
  RESPONSE_TIMES, HOTSPOT_VILLAGES, COMPENSATION_TREND,
} from '../data/dashboard';

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ stat }) {
  const TrendIcon = stat.trend === 'up' ? TrendingUpIcon
    : stat.trend === 'down' ? TrendingDownIcon
    : MinusIcon;
  const trendColor = stat.trend === 'up' ? 'text-red-500' : stat.trend === 'down' ? 'text-forest-500' : 'text-gray-400';

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-xl`}>
          {stat.icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon size={13} />
          <span>{stat.change}</span>
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight mt-0.5">{stat.label}</p>
      </div>
    </div>
  );
}

// ── Risk badge ────────────────────────────────────────────────
function RiskBadge({ risk }) {
  const cls = risk === 'Critical' ? 'risk-critical'
    : risk === 'High' ? 'risk-high'
    : risk === 'Medium' ? 'risk-medium'
    : 'risk-low';
  return (
    <span className={`agent-badge ${cls}`}>{risk}</span>
  );
}

// ── Map placeholder ───────────────────────────────────────────
function MapPlaceholder() {
  return (
    <div className="glass-card p-5 col-span-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Gir Forest Conflict Map</h3>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-forest-500" />Forest</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500" />Lion Sighting</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" />High Risk Zone</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500" />Patrol Route</span>
        </div>
      </div>
      <div className="relative h-72 bg-gradient-to-br from-forest-900/20 to-emerald-900/10 dark:from-forest-900/40 dark:to-emerald-900/30 rounded-2xl border border-forest-200 dark:border-forest-900/50 overflow-hidden">
        {/* SVG map placeholder */}
        <svg viewBox="0 0 800 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Gir Forest boundary (simplified polygon) */}
          <polygon
            points="150,60 300,40 480,55 600,80 640,140 580,200 460,220 320,230 180,210 100,160 90,100"
            fill="rgba(22,163,74,0.15)" stroke="rgba(22,163,74,0.5)" strokeWidth="2" strokeDasharray="6,3"
          />
          {/* Village dots */}
          {[
            { x: 200, y: 150, name: 'Sasan Gir',  risk: 'Critical', color: '#ef4444' },
            { x: 280, y: 120, name: 'Babariya',   risk: 'High',     color: '#f97316' },
            { x: 380, y: 100, name: 'Mendarda',   risk: 'High',     color: '#f97316' },
            { x: 490, y: 140, name: 'Dhari',      risk: 'Medium',   color: '#eab308' },
            { x: 170, y: 200, name: 'Talala',     risk: 'Medium',   color: '#eab308' },
            { x: 390, y: 195, name: 'Visavadar',  risk: 'Medium',   color: '#eab308' },
            { x: 560, y: 210, name: 'Kodinar',    risk: 'Low',      color: '#22c55e' },
          ].map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r={8} fill={v.color} opacity="0.8" />
              <circle cx={v.x} cy={v.y} r={14} fill={v.color} opacity="0.15" />
              <text x={v.x + 12} y={v.y + 4} fontSize="9" fill="#6b7280">{v.name}</text>
            </g>
          ))}
          {/* Lion sightings */}
          {[
            { x: 240, y: 130 }, { x: 330, y: 110 }, { x: 430, y: 160 },
          ].map((s, i) => (
            <g key={i}>
              <polygon points={`${s.x},${s.y-10} ${s.x+9},${s.y+7} ${s.x-9},${s.y+7}`}
                fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" opacity="0.9" />
            </g>
          ))}
          {/* Patrol route */}
          <polyline
            points="200,150 260,130 330,110 410,115 490,140 550,175"
            fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="8,4" opacity="0.7"
          />
          {/* Labels */}
          <text x="310" y="170" fontSize="11" fontWeight="bold" fill="rgba(22,163,74,0.8)">Gir National Park</text>
          <text x="310" y="183" fontSize="9" fill="rgba(22,163,74,0.6)">Core Zone</text>
        </svg>

        {/* Overlay: last updated */}
        <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-gray-500">
          Last updated: {new Date().toLocaleTimeString()} • Live simulation
        </div>
      </div>
    </div>
  );
}

// ── Dashboard page ────────────────────────────────────────────
export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Gir Forest Human-Wildlife Conflict Monitoring • Real-time insights
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs bg-forest-50 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {STATS.map(stat => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly incidents */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
            Weekly Conflict Incidents
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_INCIDENTS} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb' }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="lions"    name="Lions"    fill="#f59e0b" radius={[4,4,0,0]} />
              <Bar dataKey="leopards" name="Leopards" fill="#ef4444" radius={[4,4,0,0]} />
              <Bar dataKey="others"   name="Others"   fill="#6b7280" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly sightings */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
            Monthly Wildlife Sightings
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_SIGHTINGS}>
              <defs>
                <linearGradient id="lionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="leopardsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="lions"    name="Lions"    stroke="#f59e0b" fill="url(#lionsGrad)"    strokeWidth={2} />
              <Area type="monotone" dataKey="leopards" name="Leopards" stroke="#ef4444" fill="url(#leopardsGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Response time trend */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
            Average Response Time (minutes)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={RESPONSE_TIMES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Line
                type="monotone" dataKey="avgMinutes" name="Avg. Response (min)"
                stroke="#16a34a" strokeWidth={2.5} dot={{ r: 4, fill: '#16a34a' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Compensation trends */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
            Compensation Cases Trend
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={COMPENSATION_TREND} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="filed"    name="Filed"    fill="#8b5cf6" radius={[4,4,0,0]} />
              <Bar dataKey="approved" name="Approved" fill="#22c55e" radius={[4,4,0,0]} />
              <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map */}
      <div className="grid grid-cols-1 gap-4">
        <MapPlaceholder />
      </div>

      {/* Hotspot table */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm">
          Village Risk Assessment
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Village</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Risk Level</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Incidents (YTD)</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Coordinates</th>
                <th className="text-left pb-3 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {HOTSPOT_VILLAGES.map((v, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-2.5 font-medium text-gray-900 dark:text-gray-100">{v.name}</td>
                  <td className="py-2.5"><RiskBadge risk={v.risk} /></td>
                  <td className="py-2.5 text-gray-600 dark:text-gray-400">{v.incidents}</td>
                  <td className="py-2.5 text-gray-400 dark:text-gray-500 font-mono text-xs">{v.lat}°N, {v.lng}°E</td>
                  <td className="py-2.5">
                    <span className={`inline-flex items-center gap-1.5 text-xs ${
                      v.risk === 'Critical' || v.risk === 'High'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        v.risk === 'Critical' ? 'bg-red-500 animate-pulse'
                        : v.risk === 'High' ? 'bg-orange-500'
                        : 'bg-gray-400'
                      }`} />
                      {v.risk === 'Critical' ? 'Alert Active' : v.risk === 'High' ? 'Monitoring' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
