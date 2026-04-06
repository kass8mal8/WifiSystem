import React, { useState } from 'react';
import type { WifiUser } from '../api';
import { X, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface RenewalModalProps {
  user: WifiUser;
  onRenew: (id: string, newExpiry: string, amount: number, method: string) => Promise<void>;
  onClose: () => void;
}

type Duration = '24h' | '1w' | '1m';

export default function RenewalModal({ user, onRenew, onClose }: RenewalModalProps) {
  const [duration, setDuration] = useState<Duration>('24h');
  const [amount, setAmount] = useState('20');
  const [method, setMethod] = useState('MPesa');
  const [loading, setLoading] = useState(false);

  const handleDurationChange = (dur: Duration) => {
    setDuration(dur);
    const prices = { '24h': '20', '1w': '80', '1m': '300' };
    setAmount(prices[dur]);
  };

  const calculateNewExpiry = (currentExpiry: string, dur: Duration) => {
    const expiryDate = new Date(currentExpiry);
    const now = new Date();
    // If user is already expired, start extension from now.
    // If user still has time, extension starts from their current expiry.
    const baseDate = expiryDate > now ? new Date(expiryDate) : new Date(now);
    
    if (dur === '24h') baseDate.setHours(baseDate.getHours() + 24);
    else if (dur === '1w') baseDate.setDate(baseDate.getDate() + 7);
    else if (dur === '1m') baseDate.setMonth(baseDate.getMonth() + 1);
    
    return baseDate.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user._id) return;
    setLoading(true);
    try {
      const newExpiry = calculateNewExpiry(user.paymentExpiryDate, duration);
      await onRenew(user._id, newExpiry, Number(amount), method);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to renew subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <RefreshCw size={18} className="text-indigo-400" />
            Renew Subscription
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-400 mb-2">Renewing for:</p>
            <p className="text-lg font-semibold text-white">{user.name}</p>
            <p className="text-xs text-slate-500 font-mono mt-1">{user.macAddress}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Select Duration</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: '24h', label: '24 Hours' },
                { id: '1w', label: '1 Week' },
                { id: '1m', label: '1 Month' },
              ].map((opt) => (
                <label 
                  key={opt.id}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer border transition-all
                    ${duration === opt.id 
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'}
                  `}
                >
                  <input 
                    type="radio" 
                    className="sr-only" 
                    checked={duration === opt.id} 
                    onChange={() => handleDurationChange(opt.id as Duration)} 
                  />
                  <span className="text-xs font-medium text-center">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Amount (Ksh)</label>
              <input 
                type="number" 
                required 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Method</label>
              <select 
                value={method} 
                onChange={e => setMethod(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option>Cash</option>
                <option>MPesa</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : 'Confirm Renewal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
