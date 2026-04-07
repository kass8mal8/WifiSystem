import { useState, useMemo } from 'react';
import type { WifiUser } from '../api';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  ArrowUpRight,
  Target
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Skeleton from '../components/Skeleton';

interface ReportsPageProps {
  users: WifiUser[];
  loading?: boolean;
}

type Timeframe = 'daily' | 'weekly' | 'monthly';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

export default function ReportsPage({ users, loading }: ReportsPageProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('daily');
  const now = Date.now();

  const isActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

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

  const totalRevenue = users.reduce((s, u) => s + parseFloat(u.amountPaid.toString()), 0);
  const activeCount = users.filter(u => isActive(u)).length;
  const expiredCount = users.filter(u => !isActive(u)).length;
  const avgRevenue = users.length ? (totalRevenue / users.length).toFixed(0) : '0';
  
  const expiringSoon = users.filter(
    u => isActive(u) && new Date(u.paymentExpiryDate).getTime() < now + 3 * 24 * 60 * 60 * 1000
  ).length;

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

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
             <FileText className="text-indigo-400" size={16} />
             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-3)]">Business Reports</span>
          </div>
          <h2 className="hidden md:block text-2xl font-black text-[var(--text-1)] tracking-tight">Sales <span className="text-indigo-500">Reports</span></h2>
          <p className="hidden md:block text-[var(--text-3)] text-sm mt-0.5 font-medium">Summary of payments and user subscriptions.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex bg-[var(--bg-app)]/50 p-1.5 rounded-[1rem] border border-[var(--border)] shadow-inner">
             {(['daily', 'weekly', 'monthly'] as const).map(t => (
               <button key={t} onClick={() => setTimeframe(t)}
                 className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                   timeframe === t ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-[var(--text-3)] hover:text-[var(--text-1)]'
                 }`}>
                 {t}
               </button>
             ))}
           </div>
           
           <button className="p-2.5 rounded-xl bg-[var(--bg-card)] text-[var(--text-2)] hover:text-indigo-500 border border-[var(--border)] transition-all shadow-sm group">
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'Total Revenue', value: `Ksh ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={16}/>, color: 'indigo', sub: 'Total Earned' },
          { label: 'Active Users', value: activeCount, icon: <CheckCircle size={16}/>, color: 'emerald', sub: 'Currently Paid' },
          { label: 'Expired Users', value: expiredCount, icon: <XCircle size={16}/>, color: 'rose', sub: 'Action Required' },
          { label: 'Expiring Soon', value: expiringSoon, icon: <Target size={16}/>, color: 'amber', sub: 'Next 3 Days' },
        ].map(card => (
          <div key={card.label} className={`bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.25rem] p-4 lg:p-5 border border-[var(--border)] group hover:border-${card.color}-500/30 transition-all duration-300 relative overflow-hidden shadow-sm`}>
            <div className={`inline-flex p-2 rounded-xl bg-${card.color}-500/10 text-${card.color}-400 mb-3 shadow-inner border border-${card.color}-500/10 transition-transform group-hover:scale-110 duration-300`}>{card.icon}</div>
            <div>
              {loading ? <Skeleton width="80%" height={24} className="rounded-lg mb-1" /> : <p className="text-xl md:text-2xl font-black text-[var(--text-1)] tracking-tighter drop-shadow-sm leading-tight">{card.value}</p>}
              <p className={`text-[9px] font-black text-${card.color}-500 uppercase tracking-widest mt-0.5`}>{card.label}</p>
              <div className="flex items-center gap-1 mt-2.5 opacity-60">
                 <ArrowUpRight size={10} className="text-[var(--text-3)]" />
                 <span className="text-[8px] font-bold text-[var(--text-3)] uppercase tracking-tight">{card.sub}</span>
              </div>
            </div>
            
            <div className={`absolute -right-6 -top-6 w-20 h-20 bg-${card.color}-500/5 rounded-full blur-[20px] pointer-events-none group-hover:scale-150 transition-transform duration-700`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Earnings Chart */}
        <div className="lg:col-span-8 bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] p-5 shadow-sm border border-[var(--border)] flex flex-col relative group transition-colors duration-500 hover:border-indigo-500/20 h-full">
          <div className="flex items-center justify-between mb-8 relative z-10 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm group-hover:rotate-3 transition-transform">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">Earnings History</h3>
            </div>
            <div className="flex items-center gap-4 bg-[var(--bg-app)]/50 px-4 py-2 rounded-full border border-[var(--border)] shadow-inner">
                <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,0.5)]"></div>
                   <span className="text-[8px] font-black text-[var(--text-3)] uppercase tracking-widest">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                   <span className="text-[8px] font-black text-[var(--text-3)] uppercase tracking-widest">Users</span>
                </div>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[220px]">
            {loading ? (
              <Skeleton width="100%" height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke="#1e293b" vertical={false} opacity={0.3}/>
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{fontWeight:'bold'}} dy={8}/>
                  <YAxis yAxisId="rev" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="usr" orientation="right" hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area yAxisId="rev" type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={3} fill="url(#rGrad)"/>
                  <Area yAxisId="usr" type="monotone" dataKey="users" name="New Users" stroke="#10b981" strokeWidth={2} fill="url(#uGrad)"/>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-4 bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] p-5 border border-[var(--border)] flex flex-col shadow-sm hover:border-amber-500/20 transition-all duration-500 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm group-hover:rotate-12 transition-transform">
              <PieIcon size={16}/>
            </div>
            <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">Method Pool</h3>
          </div>
          
          <div className="flex-1 min-h-[160px] flex items-center justify-center relative">
            {loading ? (
              <Skeleton variant="circle" width={140} height={140} className="rounded-full shadow-inner" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData.length > 0 ? methodData : [{ name: 'N/A', value: 1 }]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                    {(methodData.length > 0 ? methodData : [{name:'n/a'}]).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)', color: 'var(--text-1)', borderRadius: '12px' }} itemStyle={{ color: 'var(--text-1)' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center">
               <span className="text-[8px] font-black text-[var(--text-3)] uppercase tracking-widest mb-0.5">Avg Paid</span>
               <span className="text-base font-black text-[var(--text-1)] drop-shadow-sm">Ksh <span className="text-[var(--text-1)]">{avgRevenue}</span></span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            {methodData.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between p-4 rounded-[1.125rem] bg-[var(--bg-app)]/40 border border-[var(--border)] shadow-inner transition-colors hover:border-amber-500/20 group/item">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] transition-transform group-hover/item:scale-150" style={{ backgroundColor: PIE_COLORS[i], color: PIE_COLORS[i] }}/>
                  <span className="text-[10px] font-black uppercase text-[var(--text-2)] tracking-widest">{m.name}</span>
                </div>
                <span className="font-black text-[var(--text-1)] text-xs">{m.value} <span className="text-[var(--text-3)]">Users</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Revenue Volume */}
        <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] p-5 shadow-sm border border-[var(--border)] hover:border-emerald-500/20 transition-all duration-500">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm group-hover:rotate-6 transition-transform">
              <BarChart3 size={16}/>
            </div>
            <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">Revenue Breakdown</h3>
          </div>

          <div className="h-[200px]">
            {loading ? <Skeleton width="100%" height="100%" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} opacity={0.6}/>
                  <XAxis dataKey="name" stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} tick={{fontWeight:'bold'}} dy={8}/>
                  <YAxis stroke="var(--text-3)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'var(--border)', opacity: 0.2}} contentStyle={{ backgroundColor: 'var(--bg-app)', borderColor: 'var(--border)', color: 'var(--text-1)', borderRadius: '12px' }} itemStyle={{ color: 'var(--text-1)' }}/>
                  <Bar dataKey="revenue" name="Total (Ksh)" radius={[6, 6, 0, 0]} barSize={40}>
                    {durationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.9} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Business Summary */}
        <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.5rem] p-5 border border-[var(--border)] shadow-sm hover:border-rose-500/20 transition-all duration-500 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-sm group-hover:-rotate-6 transition-transform">
                <Calendar size={16}/>
              </div>
              <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">Business Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 h-full">
                {[
                  { label: 'Avg Payment', value: `Ksh ${avgRevenue}` },
                  { label: 'Retention', value: '98%' },
                  { label: 'Active Share', value: `${((activeCount/(activeCount+expiredCount)) * 100 || 0).toFixed(0)}%` },
                  { label: 'Report Period', value: timeframe.toUpperCase() },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-[1.25rem] bg-[var(--bg-app)]/40 border border-[var(--border)] hover:border-indigo-500/30 transition-all shadow-inner flex flex-col justify-center relative overflow-hidden group/box">
                     <p className="text-[9px] font-black uppercase text-[var(--text-3)] tracking-widest mb-1.5 z-10 relative group-hover/box:text-[var(--text-2)]">{item.label}</p>
                     <p className="text-sm lg:text-base font-black text-[var(--text-1)] uppercase tracking-tight z-10 relative drop-shadow-sm">{item.value}</p>
                     <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 rounded-full blur-[10px] pointer-events-none transition-transform group-hover/box:scale-[2] duration-700"></div>
                  </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
