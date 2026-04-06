import { useState, useMemo } from 'react';
import type { WifiUser } from '../api';
import {
  Trash2, RefreshCw, BarChart3, TrendingUp,
  PieChart as PieIcon, Calendar, DollarSign, CheckCircle2, XCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import Skeleton from '../components/Skeleton';

interface ReportsPageProps {
  users: WifiUser[];
  loading?: boolean;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';

const PIE_COLORS = ['#6366f1', '#10b981'];

export default function ReportsPage({ users, loading }: ReportsPageProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-16">

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
            <div className="h-8">
              {loading ? <Skeleton width="80%" height={24} /> : <p className="text-2xl font-bold text-white">{card.value}</p>}
            </div>
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
          <div className="h-[260px] flex items-center justify-center">
            {loading ? (
              <Skeleton width="100%" height="100%" />
            ) : (
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
            )}
          </div>
        </div>

        {/* Payment Pie */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <PieIcon className="text-amber-400" size={18}/>
            <h3 className="font-semibold text-white">Payment Split</h3>
          </div>
          <div className="h-[170px] flex items-center justify-center">
            {loading ? (
              <Skeleton variant="circle" width={150} height={150} />
            ) : (
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
            )}
          </div>
          <div className="space-y-2 mt-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} width="100%" height={12} />)
            ) : methodData.map((m, i) => (
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
          <div className="h-[200px] flex items-center justify-center">
            {loading ? (
              <Skeleton width="100%" height="100%" />
            ) : (
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
            )}
          </div>
        </div>

        {/* Network Radar */}
        <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-5">
            <Calendar className="text-indigo-400" size={18}/>
            <h3 className="font-semibold text-white">Network Health Radar</h3>
          </div>
          <div className="h-[200px] flex items-center justify-center">
            {loading ? (
              <Skeleton variant="circle" width={180} height={180} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#1e293b"/>
                  <PolarAngleAxis dataKey="subject" stroke="#475569" fontSize={11}/>
                  <PolarRadiusAxis stroke="#334155" fontSize={9}/>
                  <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3}/>
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
