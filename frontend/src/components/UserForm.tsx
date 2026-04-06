import { useState } from 'react';
import { createUser } from '../api';
import type { WifiUser } from '../api';

interface UserFormProps {
  onUserAdded: (user: WifiUser) => void;
}

export default function UserForm({ onUserAdded }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    macAddress: '',
    paymentExpiryDate: '',
    amountPaid: '',
    methodPaid: 'Cash',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await createUser({
        name: formData.name,
        macAddress: formData.macAddress,
        paymentExpiryDate: formData.paymentExpiryDate,
        amountPaid: Number(formData.amountPaid),
        methodPaid: formData.methodPaid,
      });
      onUserAdded(newUser);
      setFormData({ name: '', macAddress: '', paymentExpiryDate: '', amountPaid: '', methodPaid: 'Cash' });
    } catch (error) {
      console.error(error);
      alert('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700/50 mb-8 backdrop-blur-sm">
      <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-400">
        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        Register New User
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
          <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">MAC Address</label>
          <input type="text" required value={formData.macAddress} onChange={e => setFormData({ ...formData, macAddress: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="00:1A:2B:3C:4D:5E" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Payment Expiry Date</label>
          <input type="date" required value={formData.paymentExpiryDate} onChange={e => setFormData({ ...formData, paymentExpiryDate: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Amount Paid ($)</label>
          <input type="number" required min="0" step="0.01" value={formData.amountPaid} onChange={e => setFormData({ ...formData, amountPaid: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all" placeholder="25.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Payment Method</label>
          <select value={formData.methodPaid} onChange={e => setFormData({ ...formData, methodPaid: e.target.value })}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all">
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>MPesa</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button disabled={loading} type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-8 rounded-lg shadow-lg shadow-indigo-600/20 active:transform active:scale-95 transition-all">
          {loading ? 'Registering...' : 'Add User'}
        </button>
      </div>
    </form>
  );
}
