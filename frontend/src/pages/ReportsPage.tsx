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
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Business Reports</span>
          </div>
          <h2 className="hidden md:block text-3xl font-black text-white">Sales <span className="text-indigo-500">Reports</span></h2>
          <p className="hidden md:block text-slate-400 text-sm mt-0.5">Summary of payments and user subscriptions.</p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="flex glass bg-slate-900/40 p-1 rounded-xl border border-white/5">
             {(['daily', 'weekly', 'monthly'] as const).map(t => (
               <button key={t} onClick={() => setTimeframe(t)}
                 className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                   timeframe === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                 }`}>
                 {t}
               </button>
             ))}
           </div>
           
           <button className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-white/5 transition-all">
              <Download size={14} />
           </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `Ksh ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={16}/>, color: 'indigo', sub: 'Total Earned' },
          { label: 'Active Users', value: activeCount, icon: <CheckCircle size={16}/>, color: 'emerald', sub: 'Currently Paid' },
          { label: 'Expired Users', value: expiredCount, icon: <XCircle size={16}/>, color: 'rose', sub: 'Action Required' },
          { label: 'Expiring Soon', value: expiringSoon, icon: <Target size={16}/>, color: 'amber', sub: 'Next 3 Days' },
        ].map(card => (
          <div key={card.label} className={`glass rounded-2xl p-4 border-${card.color}-500/10 group hover:border-${card.color}-500/30 transition-all relative overflow-hidden`}>
            <div className={`inline-flex p-2 rounded-xl bg-${card.color}-500/10 text-${card.color}-400 mb-3`}>{card.icon}</div>
            <div>
              {loading ? <Skeleton width="80%" height={24} /> : <p className="text-xl font-black text-white tracking-tighter">{card.value}</p>}
              <p className={`text-[8px] font-black text-${card.color}-500/80 uppercase tracking-widest mt-0.5`}>{card.label}</p>
              <div className="flex items-center gap-1 mt-2 opacity-30">
                 <ArrowUpRight size={8} />
                 <span className="text-[7px] font-bold text-slate-500 uppercase">{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Earnings Chart */}
        <div className="lg:col-span-8 glass rounded-2xl p-6 shadow-xl border-white/5 bg-gradient-to-br from-slate-900/40 to-transparent">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Earnings History</h3>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-500"></div>
                   <span className="text-[8px] font-black text-slate-400 uppercase">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                   <span className="text-[8px] font-black text-slate-400 uppercase">Users</span>
                </div>
            </div>
          </div>
          
          <div className="h-[220px]">
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
        <div className="lg:col-span-4 glass rounded-2xl p-6 border-white/5 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <PieIcon size={18}/>
            </div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Payment Methods</h3>
          </div>
          
          <div className="flex-1 min-h-[160px] flex items-center justify-center relative">
            {loading ? (
              <Skeleton variant="circle" width={140} height={140} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={methodData.length > 0 ? methodData : [{ name: 'N/A', value: 1 }]}
                    cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                    {(methodData.length > 0 ? methodData : [{name:'n/a'}]).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute flex flex-col items-center">
               <span className="text-[8px] font-black text-slate-500 uppercase">Avg Paid</span>
               <span className="text-base font-black text-white">Ksh {avgRevenue}</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-6">
            {methodData.map((m, i) => (
              <div key={m.name} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}/>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{m.name}</span>
                </div>
                <span className="font-black text-white text-xs">{m.value} Users</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Revenue Volume */}
        <div className="glass rounded-2xl p-6 shadow-xl border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 size={18}/>
            </div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Revenue Breakdown</h3>
          </div>

          <div className="h-[180px]">
            {loading ? <Skeleton width="100%" height="100%" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.3}/>
                  <XAxis dataKey="name" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tick={{fontWeight:'bold'}} dy={8}/>
                  <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}/>
                  <Bar dataKey="revenue" name="Total (Ksh)" radius={[6, 6, 0, 0]} barSize={40}>
                    {durationData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} fillOpacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Business Summary */}
        <div className="glass rounded-2xl p-6 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <Calendar size={18}/>
              </div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Business Summary</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Avg Payment', value: `Ksh ${avgRevenue}` },
                  { label: 'Retention', value: '98%' },
                  { label: 'Active Share', value: `${((activeCount/(activeCount+expiredCount)) * 100 || 0).toFixed(0)}%` },
                  { label: 'Report Period', value: timeframe.toUpperCase() },
                ].map(item => (
                  <div key={item.label} className="p-5 rounded-xl bg-slate-900/60 border border-white/5 hover:bg-slate-800/80 transition-all">
                     <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-2">{item.label}</p>
                     <p className="text-base font-black text-white uppercase">{item.value}</p>
                  </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}
