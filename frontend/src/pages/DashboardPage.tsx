import { useMemo } from 'react';
import type { WifiUser } from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  Wifi,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Activity,
  DollarSign
} from 'lucide-react';

interface DashboardPageProps {
  users: WifiUser[];
}

export default function DashboardPage({ users }: DashboardPageProps) {
  const now = Date.now();

  // Use expiry date as the ground truth — catches legacy records with no status field
  const isUserActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

  const totalRevenue = users.reduce((sum, u) => sum + parseFloat(u.amountPaid.toString()), 0);
  const activeUsers = users.filter(u => isUserActive(u)).length;
  const expiredUsers = users.filter(u => !isUserActive(u)).length;
  const expiringSoon = users.filter(
    u => isUserActive(u) && new Date(u.paymentExpiryDate).getTime() < now + 3 * 24 * 60 * 60 * 1000
  ).length;

  // Last 7 days revenue trend
  const revenueTrend = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      days[key] = 0;
    }
    users.forEach(u => {
      const key = new Date(u.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (key in days) days[key] += parseFloat(u.amountPaid.toString());
    });
    return Object.entries(days).map(([name, revenue]) => ({ name, revenue }));
  }, [users]);

  // Status pie chart data
  const statusData = [
    { name: 'Active', value: activeUsers },
    { name: 'Expired', value: expiredUsers },
    { name: 'Expiring Soon', value: expiringSoon },
  ].filter(d => d.value > 0);

  // Payment method breakdown
  const payMethods: Record<string, number> = {};
  users.forEach(u => { payMethods[u.methodPaid] = (payMethods[u.methodPaid] || 0) + 1; });

  // Recent activity feed (last 8 users/events)
  const recentActivity = [...users]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 8);

  const STATUS_COLORS: Record<string, string> = {
    Active: '#10b981',
    Expired: '#f43f5e',
    'Expiring Soon': '#f59e0b',
  };

  const METHOD_COLORS = ['#6366f1', '#10b981'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Command Center</h2>
          <p className="text-slate-400 text-sm">Real-time overview of your network.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium px-3 py-2 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Network Online
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: `Ksh ${totalRevenue.toLocaleString()}`,
            icon: <DollarSign size={20} />,
            color: 'indigo',
            sub: `${users.length} total records`,
          },
          {
            label: 'Active Users',
            value: activeUsers,
            icon: <CheckCircle2 size={20} />,
            color: 'emerald',
            sub: 'Currently connected',
          },
          {
            label: 'Expired',
            value: expiredUsers,
            icon: <XCircle size={20} />,
            color: 'rose',
            sub: 'Access blocked',
          },
          {
            label: 'Expiring Soon',
            value: expiringSoon,
            icon: <AlertTriangle size={20} />,
            color: 'amber',
            sub: 'Within 3 days',
          },
        ].map(card => (
          <div
            key={card.label}
            className={`relative bg-slate-800 rounded-2xl p-5 border border-${card.color}-500/20 shadow-xl overflow-hidden group hover:border-${card.color}-500/40 transition-all duration-300`}
          >
            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${card.color}-500/10 rounded-full blur-xl group-hover:bg-${card.color}-500/20 transition-all`} />
            <div className={`inline-flex p-2 rounded-lg bg-${card.color}-500/10 text-${card.color}-400 mb-3`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className={`text-xs font-medium text-${card.color}-400 mt-0.5`}>{card.label}</p>
            <p className="text-[11px] text-slate-500 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend — 2 cols */}
        <div className="lg:col-span-2 bg-slate-800/70 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-400" size={18} />
              <h3 className="text-base font-semibold text-white">Revenue (Last 7 Days)</h3>
            </div>
            <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-full border border-slate-700">Ksh</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                  itemStyle={{ color: '#6366f1' }}
                  formatter={(v: unknown) => [`Ksh ${v}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-emerald-400" size={18} />
            <h3 className="text-base font-semibold text-white">User Status</h3>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.length > 0 ? statusData : [{ name: 'No Data', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(statusData.length > 0 ? statusData : [{ name: 'No Data', value: 1 }]).map((entry, i) => (
                    <Cell
                      key={i}
                      fill={STATUS_COLORS[entry.name] || '#334155'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] }} />
                  <span className="text-slate-400">{s.name}</span>
                </div>
                <span className="font-medium text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="text-amber-400" size={18} />
            <h3 className="text-base font-semibold text-white">Payment Methods</h3>
          </div>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(payMethods).map(([name, count]) => ({ name, count }))} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} width={55} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}
                  cursor={{ fill: '#1e293b' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={28}>
                  {Object.entries(payMethods).map((_entry, idx) => (
                    <Cell key={idx} fill={METHOD_COLORS[idx % METHOD_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-slate-800/70 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <Wifi className="text-indigo-400" size={18} />
            <h3 className="text-base font-semibold text-white">Live Activity Feed</h3>
          </div>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[180px] text-slate-600">
              <Clock size={36} className="mb-3" />
              <p className="text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentActivity.map(user => {
                const isExpired = !isUserActive(user);
                return (
                  <div key={user._id} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isExpired ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium truncate">{user.name}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      isExpired
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {isExpired ? 'Expired' : 'Active'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Network Status Banner */}
      <div className="bg-gradient-to-r from-indigo-900/30 via-slate-800/60 to-emerald-900/30 border border-indigo-500/20 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="bg-indigo-500/20 p-3 rounded-xl">
          <Wifi size={22} className="text-indigo-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Airtel Smart Connect 5G</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Software gateway active. {activeUsers} device{activeUsers !== 1 ? 's' : ''} currently authorised.{' '}
            {expiredUsers > 0 && (
              <span className="text-rose-400 font-medium">{expiredUsers} expired and blocked.</span>
            )}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Gateway: Online</span>
          <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Auto-Expiry: On</span>
        </div>
      </div>
    </div>
  );
}
