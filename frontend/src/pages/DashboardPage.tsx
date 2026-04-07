import { useMemo, useState, useEffect, useRef } from 'react';
import type { WifiUser } from '../api';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import {
  Users,
  AlertTriangle,
  Activity,
  Signal,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCcw,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Server,
  Cpu,
  Radio,
  Wifi
} from 'lucide-react';
import Skeleton from '../components/Skeleton';

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
    unit?: string;
  };
  system: {
    cpu: string;
    memory: string;
    uptime: string;
    wanIp: string;
    model: string;
    firmware: string;
  };
}

interface ConnectedDevice {
  mac: string;
  ip: string;
  name: string;
  id: string;
}

export default function DashboardPage({ users, loading }: DashboardPageProps) {
  const { socket, isConnected } = useSocket();
  const [routerStatus, setRouterStatus] = useState<RouterStatus | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(10).fill(0));
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const prevConnected = useRef(isConnected);
  
  const now = Date.now();
  const isSyncing = !routerStatus || loading;
  const activeUsers = useMemo(() => users.filter(u => new Date(u.paymentExpiryDate).getTime() > now).length, [users, now]);
  const expiredUsers = useMemo(() => users.length - activeUsers, [users, activeUsers]);

  // Toast notification for connection drops/restores
  useEffect(() => {
    if (prevConnected.current !== isConnected) {
      if (isConnected) {
        toast.success('System Online. Telemetry stream restored.', {
          style: { background: 'var(--bg-card)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)' },
          iconTheme: { primary: '#34d399', secondary: 'var(--bg-card)' }
        });
      } else {
        toast.error('Connection Lost. Attempting to reconnect...', {
          style: { background: 'var(--bg-card)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' },
          iconTheme: { primary: '#f43f5e', secondary: 'var(--bg-card)' }
        });
      }
      prevConnected.current = isConnected;
    }
  }, [isConnected]);

  // WebSocket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('router_status', (data: RouterStatus) => {
      if (data && data.success) {
        setRouterStatus(data);
        const cpuVal = parseInt(data.system.cpu) || 0;
        setCpuHistory(prev => [...prev.slice(-9), cpuVal]);
      }
    });

    socket.on('router_devices', (data: { devices: ConnectedDevice[] }) => {
      setConnectedDevices(data.devices);
    });

    return () => {
      socket.off('router_status');
      socket.off('router_devices');
    };
  }, [socket]);

  const handleManualSync = () => {
    setIsManualSyncing(true);
    toast.loading('Syncing telemetry feed...', { id: 'sync', style: { background: 'var(--bg-card)', color: 'var(--text-1)', border: '1px solid var(--border)' } });
    setTimeout(() => {
      toast.success('Hardware feed synchronized.', { 
          id: 'sync',
          style: { background: 'var(--bg-card)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' },
          iconTheme: { primary: '#818cf8', secondary: 'var(--bg-card)' }
      });
      setIsManualSyncing(false);
    }, 800);
  };

  const isUserActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

  const formatUptime = (val: any) => {
    if (val === undefined || val === null) return '---';
    
    const uptimeStr = String(val).trim();
    if (uptimeStr === '0' || uptimeStr === '' || uptimeStr === '---') return '---';
    
    if (uptimeStr.includes(':')) {
      const parts = uptimeStr.split(':');
      if (parts.length >= 2) {
        const h = parts[0].padStart(1, '0');
        const m = parts[1].padStart(2, '0');
        return `${h}h ${m}m`;
      }
    }

    const s = parseInt(uptimeStr);
    if (isNaN(s) || s <= 0) return '---';
    
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    
    if (h > 24) {
      const d = Math.floor(h / 24);
      const rh = h % 24;
      return `${d}d ${rh}h`;
    }
    return `${h}h ${m}m`;
  };

  const chartW = 300;
  const chartH = 80;
  const createPoints = (data: number[]) => {
    if (data.length < 2) return `0,${chartH} ${chartW},${chartH}`;
    const stepX = chartW / (10 - 1);
    return data.map((val, i) => {
       const clamped = Math.min(100, Math.max(0, val));
       const y = chartH - (clamped / 100) * chartH;
       return `${i * stepX},${y}`;
    }).join(' ');
  };

  const cpuPoints = createPoints(cpuHistory);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10 relative">
      
      {/* Dynamic Background Elements for aesthetic cohesion */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-[-1]"></div>
      <div className="absolute bottom-[20%] left-[-5%] w-[25%] h-[25%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000 pointer-events-none z-[-1]"></div>
      
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-[1.5rem] p-5 shadow-sm overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] group-hover:bg-indigo-500/10 transition-colors pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-1.5 rounded-full shadow-inner ${isConnected ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-rose-500/10 border border-rose-500/20"}`}>
                <Radio className={isConnected ? "text-emerald-500 animate-[pulse_1.5s_infinite]" : "text-rose-500"} size={14} />
            </div>
            <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-emerald-500/80 drop-shadow-[0_0_2px_rgba(16,185,129,0.3)]' : 'text-rose-500/80'}`}>
                {isConnected ? 'Stream Active' : 'Offline'}
                </span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">
                   {isConnected ? 'Live Router Sync' : 'Reconnecting to hardware...'}
                </span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-[var(--text-1)] tracking-tight">System <span className="text-indigo-500">Overview</span></h2>
          <p className="text-[var(--text-3)] text-sm mt-0.5 font-medium hidden sm:block">Instant hardware telemetry and client management.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="flex w-full sm:w-auto bg-[var(--bg-app)]/50 rounded-xl px-5 py-3 border border-[var(--border)] shadow-inner">
             <div className="flex flex-col items-center border-r border-[var(--border)] pr-5 mr-5">
                <span className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest mb-0.5">Status</span>
                <span className={`text-xs font-black uppercase ${isConnected ? 'text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.3)]' : 'text-amber-400 animate-pulse'}`}>
                    {isConnected ? 'Online' : 'Linking'}
                </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest mb-0.5">Runtime</span>
                <span className="text-xs font-black text-[var(--text-1)]">{formatUptime(routerStatus?.system.uptime)}</span>
             </div>
          </div>
          
          <button 
             onClick={handleManualSync}
             disabled={isManualSyncing || !isConnected}
             className="flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3.5 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-xl border border-indigo-500/20 text-xs font-black uppercase text-indigo-500 tracking-widest shadow-sm transition-all focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed">
            <RefreshCcw size={14} className={isManualSyncing || (!isConnected) ? "animate-spin-slow" : ""} />
            Auto-Sync
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
         {[
           { label: 'Network Users', value: activeUsers, icon: <Users size={16}/>, color: 'indigo', shadow: 'shadow-indigo-500/20' },
           { label: 'Expired Pool', value: expiredUsers, icon: <AlertTriangle size={16}/>, color: 'rose', shadow: 'shadow-rose-500/20' },
           { label: 'Signal Link', value: routerStatus ? `${routerStatus.signal.rsrp} dBm` : null, icon: <Signal size={16}/>, color: 'emerald', shadow: 'shadow-emerald-500/20' },
           { label: 'System Load', value: routerStatus ? `${routerStatus.system.cpu}%` : null, icon: <Cpu size={16}/>, color: 'amber', shadow: 'shadow-amber-500/20' },
         ].map(stat => (
           <div key={stat.label} className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.25rem] p-3 lg:p-4 border border-[var(--border)] group hover:border-indigo-500/30 hover:-translate-y-1 transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/5 rounded-full blur-[20px] pointer-events-none transition-transform group-hover:scale-150 duration-700"></div>
              
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 shadow-sm ${stat.shadow} border border-${stat.color}-500/10 transition-transform group-hover:scale-110 duration-300`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                {stat.value !== null ? (
                  <p className={`text-xl md:text-2xl font-black text-[var(--text-1)] tracking-tighter drop-shadow-sm leading-tight`}>{stat.value}</p>
                ) : (
                  <Skeleton width="60%" height={24} className="mb-1 rounded-lg" />
                )}
                <p className="text-[9px] lg:text-[10px] font-black text-[var(--text-3)] uppercase tracking-widest mt-1 group-hover:text-[var(--text-2)] transition-colors line-clamp-1">{stat.label}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start">
        
        {/* LEFT COLUMN: WIDGETS */}
        <div className="lg:col-span-4 space-y-4 flex flex-col h-full">
            
            {/* INTERNET SPEED */}
            <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.25rem] p-4 lg:p-5 shadow-sm relative overflow-hidden group border border-[var(--border)] hover:border-emerald-500/20 transition-all duration-500">
                <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm group-hover:rotate-3 transition-transform">
                        <Activity size={16} />
                    </div>
                    <h3 className="text-[10.5px] font-black text-[var(--text-1)] uppercase tracking-widest">Network Speed</h3>
                </div>
                
                <div className="flex flex-row gap-4 relative z-10 w-full h-full">
                    <div className="flex-1 bg-[var(--bg-app)]/40 p-4 rounded-xl border border-[var(--border)] shadow-inner flex flex-col justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-[9px] uppercase tracking-widest">
                            <ArrowDownCircle size={14} className="animate-bounce" style={{ animationDuration: '3s' }} />
                            <span>Download</span>
                        </div>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1 z-10">
                        {!isSyncing ? (
                            <>
                            <span className="text-2xl font-black text-[var(--text-1)] tracking-tighter drop-shadow-[0_0_8px_rgba(52,211,153,0.15)]">{routerStatus.traffic.downloadSpeed}</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase">{routerStatus.traffic.unit || 'Mbps'}</span>
                            </>
                        ) : (
                            <Skeleton width="100%" height={40} className="rounded-lg" />
                        )}
                        </div>
                    </div>

                    <div className="flex-1 bg-[var(--bg-app)]/40 p-4 rounded-xl border border-[var(--border)] shadow-inner flex flex-col justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-indigo-400 font-black text-[9px] uppercase tracking-widest">
                            <ArrowUpCircle size={14} className="animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }} />
                            <span>Upload</span>
                        </div>
                        </div>
                        <div className="flex items-baseline gap-1 mt-1 z-10">
                        {!isSyncing ? (
                            <>
                            <span className="text-2xl font-black text-[var(--text-1)] tracking-tighter drop-shadow-[0_0_8px_rgba(99,102,241,0.15)]">{routerStatus.traffic.uploadSpeed}</span>
                            <span className="text-[9px] font-black text-indigo-400 uppercase">{routerStatus.traffic.unit || 'Mbps'}</span>
                            </>
                        ) : (
                            <Skeleton width="100%" height={40} className="rounded-lg" />
                        )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE MONITORING */}
            <div className="bg-[var(--bg-card)] backdrop-blur-xl rounded-[1.25rem] p-4 lg:p-5 border border-[var(--border)] shadow-sm relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 flex-1 flex flex-col min-h-[220px]">
                <div className="absolute -top-[20%] -right-[20%] w-[140%] h-[140%] bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm group-hover:rotate-12 transition-transform">
                        <Cpu size={16} />
                    </div>
                    <div>
                        <h3 className="text-[10.5px] font-black text-[var(--text-1)] uppercase tracking-widest">Hardware Telemetry</h3>
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Live Feed Active</p>
                    </div>
                    </div>
                    <Activity size={14} className="text-indigo-500/40 animate-[pulse_2s_infinite]" />
                </div>
                
                <div className="relative z-10 flex-1 flex flex-col justify-end h-full">
                    <div className="flex flex-col items-start mb-4 w-full cursor-default">
                        <div className="flex items-baseline gap-1.5 w-full border-b border-[var(--border)] pb-2.5 mb-3 relative">
                            <span className={`text-4xl font-black tracking-tighter leading-none transition-colors duration-300 ${parseInt(routerStatus?.system.cpu || '0') > 80 ? 'text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]'}`}>
                                {routerStatus?.system.cpu || '0'}
                            </span>
                            <span className="text-xl font-black text-[var(--text-3)]">%</span>
                            <span className="text-[8px] font-black text-[var(--text-2)] uppercase tracking-widest ml-auto translate-y-[-4px]">Compute</span>
                            
                            {/* Subtle updating flash */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-indigo-400 blur-xl opacity-0 animate-[pulse_1s_infinite] pointer-events-none"></div>
                        </div>
                    </div>
                    
                    <div className="relative w-full h-[80px] bg-[var(--bg-app)]/40 rounded-xl border border-[var(--border)] shadow-inner flex items-end pt-3 group-hover:border-indigo-500/20 transition-colors">
                        <div className="absolute inset-x-0 inset-y-4 flex flex-col justify-between pointer-events-none opacity-[0.15] px-4">
                            <div className="w-full border-t border-[var(--text-3)] border-dashed"></div>
                            <div className="w-full border-t border-[var(--text-3)] border-dashed"></div>
                            <div className="w-full border-t border-[var(--text-3)] border-dashed"></div>
                        </div>

                        <div className="absolute inset-0 overflow-hidden rounded-xl">
                            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox={`0 0 ${chartW} ${chartH}`} className="absolute bottom-0 w-full transition-all duration-300 ease-out">
                                <defs>
                                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <polygon className="transition-all duration-300 ease-out" points={`0,${chartH} ${cpuPoints} ${chartW},${chartH}`} fill="url(#cpuGrad)" />
                                <polyline className="transition-all duration-300 ease-out" points={cpuPoints} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        
                        {routerStatus && cpuHistory.length > 0 && (
                            <div 
                                className="absolute right-0 w-3 h-3 bg-[#818cf8] rounded-full shadow-[0_0_15px_rgba(99,102,241,1)] border-[2.5px] border-[#312e81] -translate-x-1.5 translate-y-[5px] ring-4 ring-indigo-500/40"
                                style={{ 
                                    bottom: `${Math.min(100, Math.max(0, cpuHistory[cpuHistory.length - 1]))}%`,
                                    transition: 'bottom 0.5s ease-out'
                                }}
                            ></div>
                        )}
                    </div>
                </div>
            </div>
            
        </div>

        {/* RIGHT COLUMN: ONLINE DEVICES TABLE */}
        <div className="lg:col-span-8 flex flex-col h-full min-h-[400px]">
          {/* Title Area */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0 px-2 relative z-10 w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 shadow-sm animate-bounce-subtle" style={{ animationDuration: '4s' }}>
                <Smartphone size={16} />
              </div>
              <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest block sm:hidden md:block">Connected Clients</h3>
            </div>
            <div className="flex items-center">
                {connectedDevices.length > 0 ? (
                  <span className="text-[10px] font-black text-amber-500 uppercase bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20 shadow-inner flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      {connectedDevices.length} Connected
                  </span>
                ) : <Skeleton width={100} height={24} className="rounded-full" />}
            </div>
          </div>
          
          <div className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] z-10 shadow-sm bg-[var(--bg-card)] backdrop-blur-xl scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-transparent flex-1 h-full max-h-[800px] overflow-y-auto relative group hover:border-indigo-500/30 transition-colors duration-500">
             <div className="absolute top-[-10%] left-[-5%] w-48 h-48 bg-amber-500/5 rounded-full blur-[50px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
             
             {/* DATA TABLE */}
             <table className="w-full text-left text-xs whitespace-nowrap min-h-[300px]">
                <thead className="text-[var(--text-3)] font-black uppercase tracking-widest bg-[var(--bg-card)]/80 border-b border-[var(--border)] sticky top-0 z-20 backdrop-blur-md">
                    <tr>
                        <th className="py-4 px-5">Client Interface</th>
                        <th className="py-4 px-5 hidden sm:table-cell">IP Allocation</th>
                        <th className="py-4 px-5 hidden md:table-cell">MAC Hash</th>
                        <th className="py-4 px-5 text-right">Access Level</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]/50">
                    {!isConnected && connectedDevices.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => (
                           <tr key={i} className="hover:bg-[var(--hover-bg)]/50 transition-colors">
                              <td className="py-4 px-5"><Skeleton width="60%" height={16} className="rounded-md" /></td>
                              <td className="py-4 px-5 hidden sm:table-cell"><Skeleton width="50%" height={16} className="rounded-md" /></td>
                              <td className="py-4 px-5 hidden md:table-cell"><Skeleton width="70%" height={16} className="rounded-md" /></td>
                              <td className="py-4 px-5 text-right">
                                <div className="flex justify-end"><Skeleton width={80} height={22} className="rounded-full" /></div>
                              </td>
                           </tr>
                        ))
                    ) : connectedDevices.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-24 bg-[var(--bg-card)]/30 text-center h-full">
                                <div className="flex flex-col items-center justify-center h-full w-full opacity-80 zoom-in-95 animate-in duration-500">
                                    <div className="relative mb-6">
                                       <div className="absolute inset-0 bg-indigo-500/20 blur-[30px] rounded-full scale-150 animate-[pulse_3s_infinite]"></div>
                                       <div className="relative p-6 bg-[var(--bg-app)]/50 rounded-full border border-[var(--border)] shadow-xl">
                                          <Wifi size={32} className="text-indigo-400/50" />
                                       </div>
                                       <div className="absolute top-0 right-0 w-3 h-3 bg-rose-500 rounded-full border-2 border-[var(--bg-card)] shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-bounce delay-100"></div>
                                    </div>
                                    <h4 className="text-sm font-black text-[var(--text-1)] uppercase tracking-widest mb-2">Telemetry Silence</h4>
                                    <p className="text-[11px] font-medium text-[var(--text-3)] max-w-[200px]">No active authenticated devices detected on the network overlay.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        connectedDevices.map((device, i) => {
                            const registeredUser = users.find(u => u.macAddress?.toLowerCase() === device.mac.toLowerCase());
                            const isRegistered = registeredUser && isUserActive(registeredUser);
                            
                            return (
                                <tr 
                                    key={device.mac} 
                                    className="group/row hover:bg-indigo-500/5 transition-all animate-in fade-in slide-in-from-bottom-2"
                                    style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'both' }}
                                >
                                    <td className="py-4 px-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] shadow-sm group-hover/row:border-indigo-500/30 group-hover/row:scale-110 transition-all ${isRegistered ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                <Server size={12} />
                                            </div>
                                            <span className="font-black text-[var(--text-2)] group-hover/row:text-[var(--text-1)] transition-colors truncate max-w-[150px]">{device.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-5 font-mono text-[11px] font-medium text-[var(--text-3)] hidden sm:table-cell">{device.ip}</td>
                                    <td className="py-4 px-5 font-mono text-[11px] font-medium text-[var(--text-4)] uppercase hidden md:table-cell">{device.mac}</td>
                                    <td className="py-4 px-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border shadow-sm transition-colors ${
                                                isRegistered ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20 group-hover/row:bg-rose-500/20'
                                            }`}>
                                                {isRegistered ? 'Authorized' : 'Guest Null'}
                                            </span>
                                            {isRegistered ? <ShieldCheck className="text-emerald-500" size={16} /> : <ShieldAlert className="text-rose-500" size={16} />}
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

      </div>
    </div>
  );
}
