import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api';
import type { WifiUser } from '../api';
import { toast } from 'react-hot-toast';
import { UserPlus, Wifi, Clock, Calendar, CalendarDays, CheckCircle2, Loader2 } from 'lucide-react';

interface AddUserPageProps {
  onUserAdded: (user: WifiUser) => void;
}

type SubscriptionDuration = '24h' | '1w' | '1m';

const DURATION_OPTIONS: { id: SubscriptionDuration; label: string; sublabel: string; price: string; icon: React.ReactNode; color: string }[] = [
  { id: '24h', label: '24 Hours', sublabel: 'Day pass', price: 'Ksh 20', icon: <Clock size={22} />, color: 'indigo' },
  { id: '1w',  label: '1 Week',   sublabel: 'Weekly plan', price: 'Ksh 80', icon: <Calendar size={22} />, color: 'emerald' },
  { id: '1m',  label: '1 Month',  sublabel: 'Monthly plan', price: 'Ksh 300', icon: <CalendarDays size={22} />, color: 'amber' },
];

const PRICES: Record<SubscriptionDuration, string> = { '24h': '20', '1w': '80', '1m': '300' };

export default function AddUserPage({ onUserAdded }: AddUserPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', macAddress: '', amountPaid: '20', methodPaid: 'Cash' });
  const [duration, setDuration] = useState<SubscriptionDuration>('24h');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      toast.success('User registered successfully!');
      setTimeout(() => navigate('/reports'), 1200);
    } catch (error) {
      console.error(error);
      toast.error('Failed to add user. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">

      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Add New User</h2>
        <p className="text-slate-400 text-sm">Register a client and assign their connectivity plan.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Identity card */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-700/50 flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/20">
              <UserPlus size={18} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Client Identity</p>
              <p className="text-xs text-slate-500">Full name and device MAC address</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Jane Doe"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">MAC Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.macAddress}
                  onChange={e => setFormData({ ...formData, macAddress: e.target.value })}
                  placeholder="00:1A:2B:3C:4D:5E"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-slate-200 text-sm font-mono placeholder:text-slate-600 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                />
                <Wifi size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Subscription plan */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-700/50 flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg border border-emerald-500/20">
              <CalendarDays size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Subscription Plan</p>
              <p className="text-xs text-slate-500">Select duration — amount is set automatically</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-3 gap-3">
            {DURATION_OPTIONS.map(opt => {
              const active = duration === opt.id;
              return (
                <label
                  key={opt.id}
                  className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                    active
                      ? `border-${opt.color}-500 bg-${opt.color}-500/10`
                      : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    checked={active}
                    onChange={() => handleDurationChange(opt.id)}
                  />
                  <span className={`${active ? `text-${opt.color}-400` : 'text-slate-500'} transition-colors`}>
                    {opt.icon}
                  </span>
                  <div className="text-center">
                    <p className={`text-sm font-bold ${active ? 'text-white' : 'text-slate-400'} transition-colors`}>{opt.label}</p>
                    <p className={`text-[11px] ${active ? `text-${opt.color}-400` : 'text-slate-600'} transition-colors`}>{opt.sublabel}</p>
                  </div>
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    active ? `bg-${opt.color}-500/20 text-${opt.color}-300` : 'bg-slate-800 text-slate-500'
                  } transition-all`}>
                    {opt.price}
                  </div>
                  {active && (
                    <div className={`absolute top-2 right-2 text-${opt.color}-400`}>
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* Payment details */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 shadow-xl backdrop-blur-md overflow-hidden">
          <div className="px-6 py-4 bg-slate-900/40 border-b border-slate-700/50 flex items-center gap-3">
            <div className="bg-amber-500/20 p-2 rounded-lg border border-amber-500/20">
              <span className="text-amber-400 font-bold text-sm">Ksh</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Payment Details</p>
              <p className="text-xs text-slate-500">Amount and method of payment</p>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Amount (Ksh)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.amountPaid}
                onChange={e => setFormData({ ...formData, amountPaid: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
              />
              <p className="text-[10px] text-slate-600">Editable in case of custom pricing</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Payment Method</label>
              <div className="grid grid-cols-2 gap-3">
                {['Cash', 'MPesa'].map(method => (
                  <label
                    key={method}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl cursor-pointer border-2 transition-all text-sm font-medium ${
                      formData.methodPaid === method
                        ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                        : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={formData.methodPaid === method}
                      onChange={() => setFormData({ ...formData, methodPaid: method })}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || success}
          className={`w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
            success
              ? 'bg-emerald-600 text-white shadow-emerald-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.98]'
          }`}
        >
          {success ? (
            <>
              <CheckCircle2 size={20} />
              User Registered! Redirecting…
            </>
          ) : loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Registering…
            </>
          ) : (
            <>
              <UserPlus size={20} />
              Register Client
            </>
          )}
        </button>
      </form>
    </div>
  );
}
