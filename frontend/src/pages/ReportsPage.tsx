import { useState, useMemo } from 'react';
import type { WifiUser } from '../api';
import {
  Users, Trash2, RefreshCw, BarChart3, TrendingUp,
  PieChart as PieIcon, Calendar, DollarSign, CheckCircle2, XCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import RenewalModal from '../components/RenewalModal';

interface ReportsPageProps {
  users: WifiUser[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, user: Partial<WifiUser>) => Promise<void>;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';

const PIE_COLORS = ['#6366f1', '#10b981'];

export default function ReportsPage({ users, onDelete, onUpdate }: ReportsPageProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const [selectedUser, setSelectedUser] = useState<WifiUser | null>(null);
  const now = Date.now();

  const isActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

  // ── Time series aggregation ──────────────────────────────────────────────
  const chartData = useMemo(() => {
    const data: Record<string, { name: string; revenue: number; users: number; sortKey: string }> = {};
    users.forEach(user => {
      const date = new Date(user.createdAt || Date.now());
      let key = '', label = '', sortKey = '';
      if (timeframe === 'daily') {
        key = date.toISOString().split('T')[0];
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        sortKey = key;
      } else if (timeframe === 'weekly') {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay());
        key = d.toISOString().split('T')[0];
        label = `Wk ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        sortKey = key;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        sortKey = key;
      }
      if (!data[key]) data[key] = { name: label, revenue: 0, users: 0, sortKey };
      data[key].revenue += parseFloat(user.amountPaid.toString());
      data[key].users += 1;
    });
    return Object.values(data).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [users, timeframe]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalRevenue = users.reduce((s, u) => s + parseFloat(u.amountPaid.toString()), 0);
  const activeCount = users.filter(u => isActive(u)).length;
  const expiredCount = users.filter(u => !isActive(u)).length;
  const avgRevenue = users.length ? (totalRevenue / users.length).toFixed(0) : '0';

  const methodData = useMemo(() => {
    const m: Record<string, number> = {};
    users.forEach(u => { m[u.methodPaid] = (m[u.methodPaid] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [users]);

  const durationData = useMemo(() => {
    const d: Record<string, { revenue: number; count: number }> = { Cash: { revenue: 0, count: 0 }, MPesa: { revenue: 0, count: 0 } };
    users.forEach(u => {
      const key = u.methodPaid in d ? u.methodPaid : 'Cash';
      d[key].revenue += parseFloat(u.amountPaid.toString());
      d[key].count += 1;
    });
    return Object.entries(d).map(([name, v]) => ({ name, ...v, avg: v.count ? +(v.revenue / v.count).toFixed(0) : 0 }));
  }, [users]);

  const radarData = [
    { subject: 'Active', value: activeCount },
    { subject: 'Expired', value: expiredCount },
    { subject: 'Revenue', value: Math.min(totalRevenue / 100, 100) },
    { subject: 'MPesa', value: methodData.find(m => m.name === 'MPesa')?.value || 0 },
    { subject: 'Cash', value: methodData.find(m => m.name === 'Cash')?.value || 0 },
  ];

  const handleRenew = async (id: string, newExpiry: string, amount: number, method: string) =>
    onUpdate(id, { paymentExpiryDate: newExpiry, amountPaid: amount, methodPaid: method });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Analytics & Reports</h2>
          <p className="text-slate-400 text-sm">Comprehensive connectivity and revenue data.</p>
        </div>
        <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-700 self-start md:self-auto">
          {(['daily', 'weekly', 'monthly'] as const).map(t => (
            <button key={t} onClick={() => setTimeframe(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeframe === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `Ksh ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={18}/>, color: 'indigo' },
          { label: 'Active Users', value: activeCount, icon: <CheckCircle2 size={18}/>, color: 'emerald' },
          { label: 'Expired Users', value: expiredCount, icon: <XCircle size={18}/>, color: 'rose' },
          { label: 'Avg. Revenue', value: `Ksh ${avgRevenue}`, icon: <TrendingUp size={18}/>, color: 'amber' },
        ].map(card => (
          <div key={card.label}
            className={`bg-slate-800 border border-${card.color}-500/20 rounded-2xl p-5 relative overflow-hidden group hover:border-${card.color}-500/40 transition-all`}>
            <div className={`absolute -right-4 -top-4 w-16 h-16 bg-${card.color}-500/10 rounded-full blur-xl group-hover:bg-${card.color}-500/20 transition-all`} />
            <div className={`inline-flex p-2 rounded-lg bg-${card.color}-500/10 text-${card.color}-400 mb-3`}>{card.icon}</div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className={`text-xs font-medium text-${card.color}-400 mt-0.5`}>{card.label}</p>
          </div>
        ))}
      </div>

      {/* ── Primary Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend — 2/3 width */}
        <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-400" size={18} />
              <h3 className="font-semibold text-white">Revenue & Registrations</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-700">{timeframe}</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="rev" stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
                <YAxis yAxisId="usr" orientation="right" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false}/>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}/>
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '12px', color: '#94a3b8' }}/>
                <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue (Ksh)" stroke="#6366f1" strokeWidth={2} fill="url(#rGrad)"/>
                <Area yAxisId="usr" type="monotone" dataKey="users" name="New Users" stroke="#10b981" strokeWidth={2} fill="url(#uGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Pie */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <PieIcon className="text-amber-400" size={18}/>
            <h3 className="font-semibold text-white">Payment Split</h3>
          </div>
          <div className="h-[170px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={methodData.length > 0 ? methodData : [{ name: 'No Data', value: 1 }]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={5} dataKey="value">
                  {(methodData.length > 0 ? methodData : []).map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-3">
            {methodData.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}/>
                  <span className="text-slate-400">{m.name}</span>
                </div>
                <span className="font-semibold text-white">{m.value} users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Secondary Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue per method bar */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="text-emerald-400" size={18}/>
            <h3 className="font-semibold text-white">Revenue by Payment Method</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false}/>
                <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px' }} cursor={{ fill: '#1e293b' }}/>
                <Bar dataKey="revenue" name="Total (Ksh)" fill="#6366f1" radius={[6,6,0,0]} barSize={50}>
                  {durationData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Radar */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="text-indigo-400" size={18}/>
            <h3 className="font-semibold text-white">Network Health Radar</h3>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b"/>
                <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11}/>
                <PolarRadiusAxis stroke="#334155" fontSize={9}/>
                <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3}/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Client Table ── */}
      <div className="bg-slate-800/80 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg">
              <Users className="text-emerald-400" size={18}/>
            </div>
            <h3 className="font-semibold text-slate-100">Client Directory</h3>
          </div>
          <div className="flex gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/>
              {activeCount} Active
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"/>
              {expiredCount} Expired
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-900/60">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium hidden md:table-cell">MAC Address</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Status</th>
                <th className="px-6 py-3 font-medium hidden sm:table-cell">Expires</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium hidden lg:table-cell">Method</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <Users size={44} className="text-slate-700 mx-auto mb-4"/>
                    <p className="text-slate-500 font-medium">No clients found. Add users to get started.</p>
                  </td>
                </tr>
              ) : (
                users.map(user => {
                  const expiry = new Date(user.paymentExpiryDate);
                  const expired = !isActive(user);
                  const expiringSoon = !expired && expiry.getTime() < now + 3 * 24 * 60 * 60 * 1000;
                  return (
                    <tr key={user._id} className="hover:bg-slate-700/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-200">{user.name}</p>
                        <p className="text-[10px] font-mono text-slate-600 md:hidden mt-0.5">{user.macAddress}</p>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell font-mono text-xs text-slate-500">{user.macAddress}</td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          expired
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : expiringSoon
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${expired ? 'bg-rose-400' : expiringSoon ? 'bg-amber-400' : 'bg-emerald-400'}`}/>
                          {expired ? 'Expired' : expiringSoon ? 'Expiring Soon' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell text-xs text-slate-400">
                        {expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <div className="text-[10px] text-slate-600">{expiry.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-400">Ksh {parseFloat(user.amountPaid.toString()).toFixed(0)}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-400">{user.methodPaid}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setSelectedUser(user)}
                            className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all" title="Renew">
                            <RefreshCw size={14}/>
                          </button>
                          <button onClick={() => user._id && onDelete(user._id)}
                            className="p-2 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white transition-all" title="Delete">
                            <Trash2 size={14}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <RenewalModal user={selectedUser} onClose={() => setSelectedUser(null)} onRenew={handleRenew}/>
      )}
    </div>
  );
}
