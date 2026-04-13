import type { WifiUser } from '../api';

interface DashboardProps {
  users: WifiUser[];
}

export default function Dashboard({ users }: DashboardProps) {
  const totalRevenue = users.reduce((sum, user) => sum + parseFloat((user.amountPaid ?? 0).toString()), 0);
  const activeUsers = users.length;
  const expiringSoon = users.filter(
    u => new Date(u.paymentExpiryDate).getTime() < Date.now() + 3 * 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-600/5 bg-slate-800 rounded-2xl p-6 border border-indigo-500/20 shadow-xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all"></div>
        <p className="text-sm font-medium text-indigo-300 mb-1">Total Revenue</p>
        <p className="text-3xl font-bold text-white tracking-tight">${totalRevenue.toFixed(2)}</p>
      </div>
      
      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 bg-slate-800 rounded-2xl p-6 border border-emerald-500/20 shadow-xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all"></div>
        <p className="text-sm font-medium text-emerald-300 mb-1">Active Users</p>
        <p className="text-3xl font-bold text-white tracking-tight">{activeUsers}</p>
      </div>
      
      <div className="bg-gradient-to-br from-rose-500/20 to-rose-600/5 bg-slate-800 rounded-2xl p-6 border border-rose-500/20 shadow-xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-500/20 rounded-full blur-2xl group-hover:bg-rose-500/30 transition-all"></div>
        <p className="text-sm font-medium text-rose-300 mb-1">Expiring Soon (&lt; 3 Days)</p>
        <p className="text-3xl font-bold text-white tracking-tight">{expiringSoon}</p>
      </div>
    </div>
  );
}
