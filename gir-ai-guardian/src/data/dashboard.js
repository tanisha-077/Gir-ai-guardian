// Dashboard mock data for charts and stats
export const STATS = [
  { id: 'alerts',       label: 'Active Wildlife Alerts',       value: 7,   change: '+2',  trend: 'up',   icon: '🚨', color: 'text-red-600 dark:text-red-400',     bg: 'bg-red-50 dark:bg-red-900/20' },
  { id: 'villages',     label: 'High-Risk Villages',           value: 12,  change: '+3',  trend: 'up',   icon: '🏘️', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 'teams',        label: 'Forest Response Teams Active', value: 5,   change: '0',   trend: 'same', icon: '🌲', color: 'text-forest-600 dark:text-forest-400', bg: 'bg-forest-50 dark:bg-forest-900/20' },
  { id: 'compensation', label: 'Pending Compensation Cases',   value: 34,  change: '-5',  trend: 'down', icon: '💰', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { id: 'movement',     label: 'Predicted Wildlife Movements', value: 9,   change: '+1',  trend: 'up',   icon: '🦁', color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
];

export const WEEKLY_INCIDENTS = [
  { day: 'Mon', lions: 3, leopards: 2, others: 1 },
  { day: 'Tue', lions: 1, leopards: 4, others: 0 },
  { day: 'Wed', lions: 5, leopards: 1, others: 2 },
  { day: 'Thu', lions: 2, leopards: 3, others: 1 },
  { day: 'Fri', lions: 4, leopards: 2, others: 0 },
  { day: 'Sat', lions: 6, leopards: 5, others: 3 },
  { day: 'Sun', lions: 3, leopards: 2, others: 1 },
];

export const MONTHLY_SIGHTINGS = [
  { month: 'Jan', lions: 18, leopards: 12 },
  { month: 'Feb', lions: 22, leopards: 15 },
  { month: 'Mar', lions: 27, leopards: 18 },
  { month: 'Apr', lions: 32, leopards: 21 },
  { month: 'May', lions: 41, leopards: 28 },
  { month: 'Jun', lions: 38, leopards: 24 },
  { month: 'Jul', lions: 29, leopards: 19 },
  { month: 'Aug', lions: 35, leopards: 22 },
];

export const RESPONSE_TIMES = [
  { month: 'Jan', avgMinutes: 38 },
  { month: 'Feb', avgMinutes: 35 },
  { month: 'Mar', avgMinutes: 42 },
  { month: 'Apr', avgMinutes: 31 },
  { month: 'May', avgMinutes: 28 },
  { month: 'Jun', avgMinutes: 25 },
  { month: 'Jul', avgMinutes: 24 },
  { month: 'Aug', avgMinutes: 22 },
];

export const HOTSPOT_VILLAGES = [
  { name: 'Sasan Gir',     risk: 'Critical', incidents: 24, lat: 21.12, lng: 70.60 },
  { name: 'Babariya',      risk: 'High',     incidents: 18, lat: 21.18, lng: 70.73 },
  { name: 'Mendarda',      risk: 'High',     incidents: 15, lat: 21.32, lng: 70.45 },
  { name: 'Dhari',         risk: 'Medium',   incidents: 11, lat: 21.33, lng: 71.02 },
  { name: 'Talala',        risk: 'Medium',   incidents: 9,  lat: 20.99, lng: 70.46 },
  { name: 'Visavadar',     risk: 'Medium',   incidents: 7,  lat: 21.36, lng: 70.73 },
  { name: 'Kodinar',       risk: 'Low',      incidents: 4,  lat: 20.79, lng: 70.70 },
];

export const COMPENSATION_TREND = [
  { month: 'Jan', filed: 12, approved: 9,  rejected: 2 },
  { month: 'Feb', filed: 15, approved: 11, rejected: 3 },
  { month: 'Mar', filed: 18, approved: 14, rejected: 2 },
  { month: 'Apr', filed: 22, approved: 17, rejected: 4 },
  { month: 'May', filed: 28, approved: 22, rejected: 5 },
  { month: 'Jun', filed: 25, approved: 20, rejected: 3 },
  { month: 'Jul', filed: 31, approved: 26, rejected: 4 },
  { month: 'Aug', filed: 34, approved: 27, rejected: 5 },
];
