import { useMemo, useState, useEffect, useCallback } from 'react';
import { fetchRouterStatus, fetchConnectedDevices } from '../api';
import type { WifiUser } from '../api';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  DollarSign,
  Signal,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  Smartphone,
  Laptop,
  ShieldCheck,
  ShieldAlert,
  Server,
  Microchip,
  Network
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'react-hot-toast';

interface DashboardPageProps {
  users: WifiUser[];
  loading?: boolean;
}

interface RouterStatus {
  success?: boolean;
  signal: {
    rsrp: string;
    sinr: string;
    signalLevel: string;
    networkType: string;
    enrch_rsrp: string;
    enrch_sinr: string;
  };
  traffic: {
    uploadSpeed: string;
    downloadSpeed: string;
  };
}

interface ConnectedDevice {
  mac: string;
  ip: string;
  name: string;
  id: string;
}

export default function DashboardPage({ users }: DashboardPageProps) {
  const [routerStatus, setRouterStatus] = useState<RouterStatus | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const now = Date.now();

  const loadRouterData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [statusResponse, devicesResponse] = await Promise.all([
        fetchRouterStatus(),
        fetchConnectedDevices()
      ]);
      
      // Resilient State: Only update if the data is valid/successful
      if (statusResponse && statusResponse.success) {
        setRouterStatus(statusResponse);
        setLastUpdated(new Date());
      }
      
      if (devicesResponse && devicesResponse.success && Array.isArray(devicesResponse.devices)) {
        setConnectedDevices(devicesResponse.devices);
      }
      // Note: We don't clear the list on failure to prevent UI flashing
    } catch (error) {
      console.error('Failed to fetch router data:', error);
      if (!silent) toast.error('Router sync failed');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRouterData(true);
    const interval = setInterval(() => loadRouterData(true), 15000); // 15s polling for more "live" feel
    return () => clearInterval(interval);
  }, [loadRouterData]);

  const isUserActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;
  const totalRevenue = users.reduce((sum, u) => sum + parseFloat(u.amountPaid.toString()), 0);
  const activeUsers = users.filter(u => isUserActive(u)).length;
  const expiredUsers = users.filter(u => !isUserActive(u)).length;
  const expiringSoon = users.filter(
    u => isUserActive(u) && new Date(u.paymentExpiryDate).getTime() < now + 3 * 24 * 60 * 60 * 1000
  ).length;

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

  const statusData = [
    { name: 'Active', value: activeUsers },
    { name: 'Expired', value: expiredUsers },
    { name: 'Soon', value: expiringSoon },
  ].filter(d => d.value > 0);

  const STATUS_COLORS: Record<string, string> = { Active: '#10b981', Expired: '#f43f5e', Soon: '#f59e0b' };

  // Helper to choose right icon for device
  const getDeviceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('pc') || n.includes('laptop') || n.includes('desktop') || n.includes('macbook')) return <Laptop size={14} />;
    if (n.includes('phone') || n.includes('galaxy') || n.includes('iphone') || n.includes('android') || n.includes('itel')) return <Smartphone size={14} />;
    return <Network size={14} />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Server className="text-indigo-500" size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Monitoring</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white">Network Central</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time throughput and subscriber health.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">System Health</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></div>
              <span className="text-xs font-bold text-slate-300">All Nodes Optimal</span>
            </div>
          </div>
          
          <button 
            onClick={() => loadRouterData()}
            disabled={isRefreshing}
            className="group flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 glass text-white text-xs font-bold px-5 py-3 rounded-2xl transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCcw size={14} className={`${isRefreshing ? 'animate-spin text-indigo-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {isRefreshing ? 'Syncing...' : 'Sync Hardware'}
          </button>
        </div>
      </div>

      {/* Hardware Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SIGNAL QUALITY CARD */}
        <div className="lg:col-span-4 glass rounded-[2rem] p-7 shadow-2xl relative overflow-hidden group border-indigo-500/10">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Signal size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 glow-indigo">
                <Signal size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Signal Quality</h3>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                {routerStatus?.signal.networkType || '---'}
              </span>
              <span className="text-[9px] text-slate-500 font-mono">
                {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
              </span>
            </div>
          </div>
          
          <div className="flex items-end gap-1.5 mb-8 h-20 px-2">
            {[1, 2, 3, 4, 5].map(bar => {
              const strength = parseInt(routerStatus?.signal.signalLevel || '0');
              const isActive = bar <= strength;
              return (
                <div 
                  key={bar}
                  className={`flex-1 rounded-full transition-all duration-700 delay-[${bar * 100}ms] ${
                    isActive 
                      ? 'bg-gradient-to-t from-indigo-600 via-indigo-400 to-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                      : 'bg-slate-700/30'
                  }`}
                  style={{ height: `${20 + (bar * 16)}%`, opacity: isActive ? 1 : 0.4 }}
                />
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/40 border border-white/5 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 mb-1">
                <Microchip size={10} className="text-indigo-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">RSRP</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white">{routerStatus?.signal.rsrp || '--'}</span>
                <span className="text-[10px] font-bold text-slate-500">dBm</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-white/5 p-3 rounded-2xl">
              <div className="flex items-center gap-1.5 mb-1">
                <Activity size={10} className="text-emerald-400" />
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">SINR</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-white">{routerStatus?.signal.sinr || '--'}</span>
                <span className="text-[10px] font-bold text-slate-500">dB</span>
              </div>
            </div>
          </div>
        </div>

        {/* DATA THROUGHPUT CARD */}
        <div className="lg:col-span-3 glass rounded-[2rem] p-7 shadow-2xl relative overflow-hidden group border-emerald-500/10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 glow-emerald">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Live Throughput</h3>
          </div>
          
          <div className="space-y-8">
            <div className="group/item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle size={14} className="text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Download</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white tracking-tighter">
                  {routerStatus?.traffic.downloadSpeed || '0.00'}
                </span>
                <span className="text-xs font-black text-emerald-400 uppercase">KB/s</span>
              </div>
              <div className="w-full bg-slate-700/20 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_#10b981]"
                  style={{ width: `${Math.min(100, (parseFloat(routerStatus?.traffic.downloadSpeed || '0') / 500) * 100)}%` }}
                />
              </div>
            </div>

            <div className="group/item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Upload</span>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-black text-white tracking-tighter">
                  {routerStatus?.traffic.uploadSpeed || '0.00'}
                </span>
                <span className="text-xs font-black text-indigo-400 uppercase">KB/s</span>
              </div>
              <div className="w-full bg-slate-700/20 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_#6366f1]"
                  style={{ width: `${Math.min(100, (parseFloat(routerStatus?.traffic.uploadSpeed || '0') / 200) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTED CLIENTS LIST */}
        <div className="lg:col-span-5 glass rounded-[2rem] p-7 shadow-2xl overflow-hidden border-amber-500/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 glow-amber">
                <Smartphone size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Device Spectrum</h3>
            </div>
            <div className="bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              <span className="text-[10px] font-black text-amber-400 uppercase">{connectedDevices.length} ACTIVE</span>
            </div>
          </div>
          
          <div className="space-y-3 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
            {connectedDevices.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-3">
                <div className="p-4 rounded-full bg-slate-900/50">
                  <Network size={30} className="opacity-20" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Silence on the wire</p>
              </div>
            ) : (
              connectedDevices.map(device => {
                const isRegistered = users.some(u => u.macAddress?.toLowerCase() === device.mac.toLowerCase() && isUserActive(u));
                return (
                  <div key={device.mac} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/30 border border-white/5 hover:bg-slate-800/40 hover:border-white/10 transition-all duration-300 group/dev">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${isRegistered ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700/20 text-slate-400 group-hover/dev:bg-rose-500/10 group-hover/dev:text-rose-400'}`}>
                      {getDeviceIcon(device.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-200 truncate leading-tight mb-0.5">{device.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-500 font-bold">{device.ip}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 font-mono">{device.mac}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {isRegistered ? (
                        <div className="flex items-center gap-1.5 bg-emerald-500/20 px-2 py-1 rounded-lg">
                          <CheckCircle2 size={10} className="text-emerald-400" />
                          <span className="text-[8px] font-black text-emerald-400 uppercase">Valid</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-rose-500/20 px-2 py-1 rounded-lg">
                          <AlertTriangle size={10} className="text-rose-400" />
                          <span className="text-[8px] font-black text-rose-400 uppercase">Unauth</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue', value: `Ksh ${totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, col: 'indigo', sub: 'Total Collections' },
          { label: 'Active', value: activeUsers, icon: <CheckCircle2 size={20} />, col: 'emerald', sub: 'Subscribed Now' },
          { label: 'Expired', value: expiredUsers, icon: <XCircle size={20} />, col: 'rose', sub: 'Access Blocked' },
          { label: 'Attention', value: expiringSoon, icon: <AlertTriangle size={20} />, col: 'amber', sub: 'Expiring Soon' },
        ].map(card => (
          <div key={card.label} className="glass rounded-3xl p-6 shadow-xl border-white/5 hover:border-white/20 transition-all duration-300 group">
            <div className={`inline-flex p-2.5 rounded-2xl bg-${card.col}-500/10 text-${card.col}-400 mb-4 transition-transform group-hover:scale-110 duration-500`}>
              {card.icon}
            </div>
            <p className="text-3xl font-black text-white tracking-tighter mb-1">{card.value}</p>
            <p className={`text-[10px] font-black text-${card.col}-400 uppercase tracking-widest`}>{card.label}</p>
            <p className="text-[9px] text-slate-500 mt-2 font-bold opacity-60 leading-tight">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Lower Row: Analytics & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* REVENUE GRAPH */}
        <div className="lg:col-span-8 glass rounded-[2.5rem] p-8 shadow-2xl border-white/5">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Financial Momentum</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">7-Day Transaction History</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <div className="h-2 w-8 rounded-full bg-indigo-900/50"></div>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" stroke="#1e293b" vertical={false} opacity={0.5} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(99, 102, 241, 0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white' }}
                  itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fill="url(#revGrad)" animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUTION CIRCLE */}
        <div className="lg:col-span-4 glass rounded-[2.5rem] p-8 shadow-2xl border-white/5 flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Activity size={20} />
            </div>
            <h3 className="text-lg font-black text-white">Segment Share</h3>
          </div>
          
          <div className="flex-1 min-h-[220px] flex justify-center items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData.length > 0 ? statusData : [{ name: 'Empty', value: 1 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1500}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.name]} stroke="none" />
                  ))}
                  {statusData.length === 0 && <Cell fill="#1e293b" stroke="none" />}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            {statusData.map(s => (
              <div key={s.name} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/40 border border-white/5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.name] }}></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-500 leading-none mb-1">{s.name}</span>
                  <span className="text-sm font-black text-white leading-none">{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
