import React, { useState } from 'react';
import { UserPlus, Wifi, Clock, Calendar, CalendarDays, CheckCircle2, Loader2, X } from 'lucide-react';
import { createUser } from '../api';
import type { WifiUser } from '../api';
import { toast } from 'react-hot-toast';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: (user: WifiUser) => void;
}

type SubscriptionDuration = '24h' | '1w' | '1m';

const DURATION_OPTIONS: { id: SubscriptionDuration; label: string; sublabel: string; price: string; icon: React.ReactNode; color: string }[] = [
  { id: '24h', label: '24 Hours', sublabel: 'Day pass', price: 'Ksh 20', icon: <Clock size={18} />, color: 'indigo' },
  { id: '1w',  label: '1 Week',   sublabel: 'Weekly plan', price: 'Ksh 80', icon: <Calendar size={18} />, color: 'emerald' },
  { id: '1m',  label: '1 Month',  sublabel: 'Monthly plan', price: 'Ksh 300', icon: <CalendarDays size={18} />, color: 'amber' },
];

const PRICES: Record<SubscriptionDuration, string> = { '24h': '20', '1w': '80', '1m': '300' };

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
  const [formData, setFormData] = useState({ name: '', macAddress: '', amountPaid: '20', methodPaid: 'Cash' });
  const [duration, setDuration] = useState<SubscriptionDuration>('24h');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDurationChange = (dur: SubscriptionDuration) => {
    setDuration(dur);
    setFormData(prev => ({ ...prev, amountPaid: PRICES[dur] }));
  };

  const calculateExpiryDate = (dur: SubscriptionDuration): string => {
    const now = new Date();
    if (dur === '24h') now.setHours(now.getHours() + 24);
    else if (dur === '1w') now.setDate(now.getDate() + 7);
    else now.setMonth(now.getMonth() + 1);
    return now.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newUser = await createUser({
        name: formData.name,
        macAddress: formData.macAddress,
        paymentExpiryDate: calculateExpiryDate(duration),
        amountPaid: Number(formData.amountPaid),
        methodPaid: formData.methodPaid,
      });
      onUserAdded(newUser);
      toast.success('User registered successfully!');
      onClose();
      // Reset form
      setFormData({ name: '', macAddress: '', amountPaid: '20', methodPaid: 'Cash' });
      setDuration('24h');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add user. Please check the details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-800 w-full max-w-lg rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/60 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
              <UserPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white">Register Client</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">New WiFi Access Connection</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">MAC Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.macAddress}
                  onChange={e => setFormData({ ...formData, macAddress: e.target.value })}
                  placeholder="00:1A:..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-sm font-mono focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                />
                <Wifi size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Connectivity Plan</label>
            <div className="grid grid-cols-3 gap-2">
              {DURATION_OPTIONS.map(opt => {
                const active = duration === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleDurationChange(opt.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                      active 
                        ? `border-${opt.color}-500 bg-${opt.color}-500/10` 
                        : 'border-slate-700 bg-slate-900/40 hover:border-slate-600'
                    }`}
                  >
                    <span className={active ? `text-${opt.color}-400` : 'text-slate-500'}>{opt.icon}</span>
                    <span className={`text-[11px] font-bold ${active ? 'text-white' : 'text-slate-400'}`}>{opt.label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      active ? `bg-${opt.color}-500/20 text-${opt.color}-300` : 'bg-slate-800 text-slate-600'
                    }`}>{opt.price}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Amount (Ksh)</label>
              <input
                type="number"
                required
                value={formData.amountPaid}
                onChange={e => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Method</label>
              <div className="grid grid-cols-2 gap-2">
                {['Cash', 'MPesa'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, methodPaid: method })}
                    className={`py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                      formData.methodPaid === method
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                        : 'border-slate-700 bg-slate-900/40 text-slate-500 hover:border-slate-600'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <UserPlus size={20} />}
              {loading ? 'Processing...' : 'Register Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
