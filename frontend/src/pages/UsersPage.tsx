import { useState } from 'react';
import type { WifiUser } from '../api';
import { Users, Trash2, RefreshCw, UserPlus, Search, Filter } from 'lucide-react';
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
  const [search, setSearch] = useState('');
  const now = Date.now();

  const isActive = (u: WifiUser) => new Date(u.paymentExpiryDate).getTime() > now;

  const handleRenew = async (id: string, newExpiry: string, amount: number, method: string) => {
    await onUpdate(id, { paymentExpiryDate: newExpiry, amountPaid: amount, methodPaid: method });
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.macAddress.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = users.filter(u => isActive(u)).length;
  const expiredCount = users.length - activeCount;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-0.5">
            <Users className="text-indigo-400" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Member Directory</span>
          </div>
          <h2 className="text-3xl font-black text-[var(--text-1)]">User <span className="text-indigo-500">List</span></h2>
          <p className="text-[var(--text-3)] text-sm mt-0.5">Manage all registered users and their status.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[var(--bg-card-alt)] px-4 py-2 rounded-xl border border-[var(--border)] flex gap-4">
            <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase">
              <span className="w-1 h-1 bg-emerald-500 rounded-full"/>
              {activeCount} Active
            </span>
            <span className="flex items-center gap-1.5 text-rose-500 text-[10px] font-black uppercase">
              <span className="w-1 h-1 bg-rose-500 rounded-full"/>
              {expiredCount} Expired
            </span>
          </div>

          <button onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            <UserPlus size={16} />
            Add New User
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]" size={16} />
            <input 
               type="text" 
               placeholder="Search by name or MAC..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-1)] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-[var(--text-4)]"
            />
         </div>
         <button className="p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors"><Filter size={16}/></button>
      </div>

      {/* Table Card */}
      <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--text-2)]">
            <thead className="text-[11px] text-[var(--text-3)] uppercase tracking-widest bg-[var(--bg-app)]/50 border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-4 font-black">Name</th>
                <th className="px-6 py-4 font-black hidden md:table-cell">MAC Address</th>
                <th className="px-6 py-4 font-black hidden sm:table-cell text-center">Status</th>
                <th className="px-6 py-4 font-black hidden sm:table-cell">Expires</th>
                <th className="px-6 py-4 font-black">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[var(--border)] divide-[var(--border)]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><Skeleton width="80%" height={14} /></td>
                    <td className="px-6 py-4 hidden md:table-cell"><Skeleton width="60%" height={12} /></td>
                    <td className="px-6 py-4 text-center"><Skeleton width={50} height={20} variant="rect" className="mx-auto rounded-full" /></td>
                    <td className="px-6 py-4"><Skeleton width="50%" height={12} /></td>
                    <td className="px-6 py-4"><Skeleton width={50} height={14} /></td>
                    <td className="px-6 py-4 text-right"><Skeleton width={24} height={24} variant="circle" className="ml-auto" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-[var(--text-4)] uppercase font-black tracking-widest opacity-50">No users found</td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const expiry = new Date(user.paymentExpiryDate);
                  const expired = !isActive(user);
                  const expiringSoon = !expired && expiry.getTime() < now + 3 * 24 * 60 * 60 * 1000;
                  return (
                    <tr key={user._id} className="hover:bg-[var(--hover-bg)] transition-colors group">
                      <td className="px-6 py-4 font-semibold text-[var(--text-1)]">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell font-mono text-[var(--text-3)] opacity-60 uppercase text-xs">{user.macAddress}</td>
                      <td className="px-6 py-4 hidden sm:table-cell text-center">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                          expired ? 'bg-rose-500/5 text-rose-500 border-rose-500/20' : 
                          expiringSoon ? 'bg-amber-500/5 text-amber-500 border-amber-500/20' : 
                          'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'
                        }`}>
                          {expired ? 'Expired' : expiringSoon ? 'Due Soon' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <p className="text-[var(--text-2)]">{expiry.toLocaleDateString()}</p>
                        <p className="text-[11px] text-[var(--text-3)] mt-0.5">{expiry.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </td>
                      <td className="px-6 py-4 font-black text-[var(--text-1)]">Ksh {parseFloat(user.amountPaid.toString()).toFixed(0)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button onClick={() => setSelectedUser(user)}
                            className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                            <RefreshCw size={14}/>
                          </button>
                          <button onClick={() => user._id && onDelete(user._id)}
                            className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
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
