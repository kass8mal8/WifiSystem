import { useMemo, useState, useEffect } from 'react';
import type { WifiUser } from '../api';
import { useSocket } from '../context/SocketContext';
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
  Globe,
  Database,
  Radio
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
  
  const now = Date.now();
  const isSyncing = !routerStatus || loading;
  const activeUsers = useMemo(() => users.filter(u => new Date(u.paymentExpiryDate).getTime() > now).length, [users, now]);
  const expiredUsers = useMemo(() => users.length - activeUsers, [users, activeUsers]);

  // WebSocket Listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('router_status', (data: RouterStatus) => {
      if (data && data.success) {
        setRouterStatus(data);
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

  const isUserActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

  const formatUptime = (val: any) => {
    if (val === undefined || val === null) return '---';
    
    const uptimeStr = String(val).trim();
    if (uptimeStr === '0' || uptimeStr === '' || uptimeStr === '---') return '---';
    
    // Handle HH:MM:SS format
    if (uptimeStr.includes(':')) {
      const parts = uptimeStr.split(':');
      if (parts.length >= 2) {
        const h = parts[0].padStart(1, '0');
        const m = parts[1].padStart(2, '0');
        return `${h}h ${m}m`;
      }
    }

    // Handle numeric seconds
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

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className={`p-1 rounded-full ${isConnected ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                <Radio className={isConnected ? "text-emerald-500 animate-[pulse_1.5s_infinite]" : "text-rose-500"} size={14} />
            </div>
            <div className="flex flex-col">
                <span className={`text-[9px] font-black uppercase tracking-widest ${isConnected ? 'text-emerald-500/80' : 'text-rose-500/80'}`}>
                {isConnected ? 'Stream Active' : 'Offline'}
                </span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tighter">
                   {isConnected ? 'Live Router Sync' : 'Reconnecting to hardware...'}
                </span>
            </div>
          </div>
          <h2 className="text-3xl font-black text-[var(--text-1)]">System <span className="text-indigo-500">Overview</span></h2>
          <p className="text-[var(--text-3)] text-sm mt-0.5">Instant hardware telemetry and client management.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--bg-card-alt)] glass rounded-xl px-4 py-2 border border-[var(--border)] shadow-sm">
             <div className="flex flex-col items-center border-r border-[var(--border)] pr-4 mr-4">
                <span className="text-[8px] font-bold text-[var(--text-3)] uppercase tracking-tighter">Status</span>
                <span className={`text-[10px] font-black uppercase ${isConnected ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
                    {isConnected ? 'Online' : 'Linking'}
                </span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-bold text-[var(--text-3)] uppercase tracking-tighter">Runtime</span>
                <span className="text-[10px] font-black text-[var(--text-1)]">{formatUptime(routerStatus?.system.uptime)}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-card-alt)] glass rounded-xl border border-[var(--border)] text-xs font-black uppercase text-indigo-400 tracking-widest shadow-sm">
            <RefreshCcw size={14} className={isConnected ? "animate-spin-slow" : ""} />
            Auto-Sync
          </div>
        </div>
      </div>

      {/* Quick Stats Layer */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'Network Users', value: activeUsers, icon: <Users size={18}/>, color: 'indigo' },
           { label: 'Expired Pool', value: expiredUsers, icon: <AlertTriangle size={18}/>, color: 'rose' },
           { label: 'Signal Strength', value: routerStatus ? `${routerStatus.signal.rsrp} dBm` : null, icon: <Signal size={18}/>, color: 'emerald' },
           { label: 'System CPU', value: routerStatus ? `${routerStatus.system.cpu}%` : null, icon: <Cpu size={18}/>, color: 'amber' },
         ].map(stat => (
           <div key={stat.label} className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border)] group hover:border-indigo-500/20 transition-all shadow-sm">
              <div className={`p-2 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400 w-fit mb-3`}>{stat.icon}</div>
              {stat.value !== null ? (
                <p className="text-2xl font-black text-[var(--text-1)]">{stat.value}</p>
              ) : (
                <Skeleton width="60%" height={28} className="mb-1" />
              )}
              <p className="text-[10px] font-black text-[var(--text-3)] uppercase tracking-widest mt-0.5">{stat.label}</p>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* INTERNET SPEED (Mbps UNIT) */}
        <div className="lg:col-span-3 bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm relative overflow-hidden group border border-[var(--border)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Activity size={20} />
            </div>
            <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">Internet Speed</h3>
          </div>
          
          <div className="flex flex-row lg:flex-col gap-6 lg:gap-8 lg:space-y-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 text-emerald-400 font-black text-[9px] uppercase tracking-widest opacity-60">
                <ArrowDownCircle size={14} />
                <span>Download</span>
              </div>
              <div className="flex items-baseline gap-2">
                {!isSyncing ? (
                  <>
                    <span className="text-2xl md:text-3xl font-black text-[var(--text-1)] tracking-tighter">{routerStatus.traffic.downloadSpeed}</span>
                    <span className="text-[10px] md:text-[11px] font-black text-emerald-500 uppercase">{routerStatus.traffic.unit || 'Mbps'}</span>
                  </>
                ) : (
                  <Skeleton width="80%" height={36} />
                )}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 text-indigo-400 font-black text-[9px] uppercase tracking-widest opacity-60">
                <ArrowUpCircle size={14} />
                <span>Upload</span>
              </div>
              <div className="flex items-baseline gap-2">
                {!isSyncing ? (
                  <>
                    <span className="text-2xl md:text-3xl font-black text-[var(--text-1)] tracking-tighter">{routerStatus.traffic.uploadSpeed}</span>
                    <span className="text-[10px] md:text-[11px] font-black text-indigo-400 uppercase">{routerStatus.traffic.unit || 'Mbps'}</span>
                  </>
                ) : (
                  <Skeleton width="80%" height={36} />
                )}
              </div>
            </div>
          </div>
          <p className="text-[8px] text-[var(--text-4)] font-black uppercase mt-4 tracking-tighter">Matches Speed Test Unit</p>
        </div>

        {/* ONLINE DEVICES TABLE */}
        <div className="lg:col-span-9 bg-[var(--bg-card)] rounded-2xl p-6 shadow-sm overflow-hidden border border-[var(--border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Smartphone size={20} />
              </div>
              <h3 className="text-[11px] font-black text-[var(--text-1)] uppercase tracking-widest">Online Devices</h3>
            </div>
            <div className="flex items-center gap-2">
                {connectedDevices.length > 0 ? (
                  <span className="text-[10px] font-black text-amber-500 uppercase bg-amber-500/5 px-4 py-1.5 rounded-full border border-amber-500/10">
                      {connectedDevices.length} Connected
                  </span>
                ) : <Skeleton width={100} height={20} className="rounded-full" />}
            </div>
          </div>
          
          <div className="overflow-x-auto min-h-[180px]">
             <table className="w-full text-left text-xs">
                <thead className="text-[var(--text-3)] font-black uppercase tracking-widest border-b border-[var(--border)] bg-[var(--bg-app)]/30">
                    <tr>
                        <th className="pb-4 px-2">Device Name</th>
                        <th className="pb-4 px-2">IP Address</th>
                        <th className="pb-4 px-2">MAC Address</th>
                        <th className="pb-4 px-2 text-right">Access</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {!isConnected && connectedDevices.length === 0 ? (
                        Array.from({ length: 4 }).map((_, i) => (
                           <tr key={i}>
                              <td className="py-4 px-2"><Skeleton width="70%" height={14} /></td>
                              <td className="py-4 px-2"><Skeleton width="60%" height={12} /></td>
                              <td className="py-4 px-2"><Skeleton width="80%" height={12} /></td>
                              <td className="py-4 px-2 text-right"><Skeleton width={70} height={20} className="ml-auto rounded-full" /></td>
                           </tr>
                        ))
                    ) : connectedDevices.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="py-10 text-center text-[var(--text-4)] font-black uppercase tracking-widest opacity-30">
                                No devices found on network
                            </td>
                        </tr>
                    ) : (
                        connectedDevices.map(device => {
                            const registeredUser = users.find(u => u.macAddress?.toLowerCase() === device.mac.toLowerCase());
                            const isRegistered = registeredUser && isUserActive(registeredUser);
                            
                            return (
                                <tr key={device.mac} className="group hover:bg-[var(--hover-bg)] transition-all">
                                    <td className="py-3 px-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded bg-[var(--bg-app)] ${isRegistered ? 'text-emerald-400' : 'text-slate-400'}`}>
                                                <Server size={10} />
                                            </div>
                                            <span className="font-black text-[var(--text-2)] truncate max-w-[120px]">{device.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 font-mono text-[var(--text-3)]">{device.ip}</td>
                                    <td className="py-3 px-2 font-mono text-[var(--text-4)] uppercase">{device.mac}</td>
                                    <td className="py-3 px-2 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                                isRegistered ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                            }`}>
                                                {isRegistered ? 'Authorized' : 'Guest'}
                                            </span>
                                            {isRegistered ? <ShieldCheck className="text-emerald-500/40" size={14} /> : <ShieldAlert className="text-rose-500/40" size={14} />}
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

      {/* HARDWARE DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Performance Monitoring */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Cpu size={18} />
                </div>
                <h3 className="text-[10px] font-black text-[var(--text-1)] uppercase tracking-widest">Hardware Performance</h3>
            </div>
            
            <div className="space-y-8">
                {/* CPU Gauge */}
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest">CPU LOAD</span>
                      <span className={`text-xs font-black ${parseInt(routerStatus?.system.cpu || '0') > 80 ? 'text-rose-500' : 'text-indigo-400'}`}>
                        {routerStatus?.system.cpu || '0'}%
                      </span>
                   </div>
                   <div className="w-full h-2 bg-[var(--bg-app)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${routerStatus?.system.cpu || 0}%` }}
                      ></div>
                   </div>
                </div>

                {/* Memory Gauge */}
                <div>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-[9px] font-black text-[var(--text-3)] uppercase tracking-widest">MEMORY USAGE</span>
                      <span className="text-xs font-black text-emerald-500">
                        {routerStatus?.system.memory || '0'}%
                      </span>
                   </div>
                   <div className="w-full h-2 bg-[var(--bg-app)] rounded-full overflow-hidden border border-[var(--border)]">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${routerStatus?.system.memory || 0}%` }}
                      ></div>
                   </div>
                </div>
            </div>
          </div>

          {/* Router Specs */}
          <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Globe size={18} />
                </div>
                <h3 className="text-[10px] font-black text-[var(--text-1)] uppercase tracking-widest">Router Details</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[
                { label: 'WAN IP', value: routerStatus?.system.wanIp || '---', icon: <Activity size={10} /> },
                { label: 'Model', value: routerStatus?.system.model || '---', icon: <Server size={10} /> },
                { label: 'Firmware', value: routerStatus?.system.firmware || '---', icon: <Database size={10} /> },
                { label: 'Hardware', value: 'ZLT X17M', icon: <Radio size={10} /> },
                ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-[var(--bg-app)]/50 border border-[var(--border)] hover:bg-[var(--hover-bg)] transition-all">
                    <div className="flex items-center justify-between opacity-30 mb-1.5">
                        <span className="text-[7px] font-black text-[var(--text-3)] uppercase tracking-widest">{item.label}</span>
                        {item.icon}
                    </div>
                    <span className="text-[9px] font-black text-[var(--text-2)] uppercase tracking-widest truncate block">{item.value}</span>
                </div>
                ))}
            </div>
          </div>
      </div>

    </div>
  );
}
