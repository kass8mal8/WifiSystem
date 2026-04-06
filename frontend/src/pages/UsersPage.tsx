import { useState } from 'react';
import type { WifiUser } from '../api';
import { Users, Trash2, RefreshCw, UserPlus } from 'lucide-react';
import RenewalModal from '../components/RenewalModal';
import AddUserModal from '../components/AddUserModal';
import Skeleton from '../components/Skeleton';

interface UsersPageProps {
  users: WifiUser[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, user: Partial<WifiUser>) => Promise<void>;
  onUserAdded: (user: WifiUser) => void;
}

export default function UsersPage({ users, loading, onDelete, onUpdate, onUserAdded }: UsersPageProps) {
  const [selectedUser, setSelectedUser] = useState<WifiUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const now = Date.now();

  const isActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

  const handleRenew = async (id: string, newExpiry: string, amount: number, method: string) => {
    await onUpdate(id, { paymentExpiryDate: newExpiry, amountPaid: amount, methodPaid: method });
    setSelectedUser(null);
  };

  const activeCount = users.filter(u => isActive(u)).length;
  const expiredCount = users.filter(u => !isActive(u)).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">User Directory</h2>
          <p className="text-slate-400 text-sm">Manage all connected WiFi users and their subscriptions.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-3 text-xs bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-700/50 h-fit">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/>
              {loading ? <Skeleton width={20} height={12} /> : activeCount} Active
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"/>
              {loading ? <Skeleton width={20} height={12} /> : expiredCount} Expired
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
          >
            <UserPlus size={18} />
            Register Client
          </button>
        </div>
      </div>

      {/* ── Client Table ── */}
      <div className="bg-slate-800/80 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          {/* ... table content remains the same ... */}
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-900/60">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">MAC Address</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Status</th>
                <th className="px-6 py-4 font-medium hidden sm:table-cell">Expires</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Method</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><Skeleton width="80%" height={16} /></td>
                    <td className="px-6 py-4 hidden md:table-cell"><Skeleton width="60%" height={12} /></td>
                    <td className="px-6 py-4 hidden sm:table-cell"><Skeleton width={60} height={20} variant="rect" className="rounded-full" /></td>
                    <td className="px-6 py-4 hidden sm:table-cell"><Skeleton width="50%" height={12} /></td>
                    <td className="px-6 py-4"><Skeleton width={50} height={16} /></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><Skeleton width={60} height={20} /></td>
                    <td className="px-6 py-4 text-right"><Skeleton width={30} height={30} variant="circle" className="ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
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

      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onUserAdded={onUserAdded} 
      />
    </div>
  );
}
