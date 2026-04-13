import type { WifiUser } from '../api';

interface UserListProps {
  users: WifiUser[];
  onDelete: (id: string) => void;
}

export default function UserList({ users, onDelete }: UserListProps) {
  return (
    <div className="bg-slate-800 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-700/50 bg-slate-800/80">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center">
          <svg className="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          Connected Users
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-400">
          <thead className="text-xs text-slate-300 uppercase bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">MAC Address</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Expiry Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium hidden lg:table-cell">Method</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No users found. Add a user to get started.
                </td>
              </tr>
            ) : (
              users.map(user => {
                const isExpiringSoon = new Date(user.paymentExpiryDate).getTime() < Date.now() + 3 * 24 * 60 * 60 * 1000;
                return (
                  <tr key={user._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {user.name}
                      {isExpiringSoon && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Expiring</span>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell font-mono text-xs">{user.macAddress}</td>
                    <td className="px-6 py-4 hidden sm:table-cell text-slate-300">
                      {new Date(user.paymentExpiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
            ${parseFloat((user.amountPaid ?? 0).toString()).toFixed(2)}
                    <td className="px-6 py-4 hidden lg:table-cell">{user?.methodPaid}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => user._id && onDelete(user._id)} className="text-slate-400 hover:text-rose-400 transition-colors p-1" title="Revoke Access">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
