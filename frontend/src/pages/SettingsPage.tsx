import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateRouterSettings } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';
import { 
  Globe, 
  Shield, 
  Wifi, 
  Save, 
  Loader2, 
  Info, 
  Moon, 
  Sun, 
  LogOut, 
  Palette,
  User as UserIcon
} from 'lucide-react';

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    routerUrl: '',
    routerUsername: '',
    routerPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        routerUrl: user.routerUrl || 'http://192.168.1.1',
        routerUsername: user.routerUsername || 'admin',
        routerPassword: '' // Don't pre-fill password for security
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await updateRouterSettings(formData);
      setUser(response.user);
      toast.success('Router settings updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-[var(--text-1)] tracking-tight">System <span className="text-indigo-500">Settings</span></h2>
        <p className="text-[var(--text-3)] text-sm font-medium">Manage your infrastructure and preferences.</p>
      </div>

      {/* Infrastructure Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 px-1 text-[var(--text-3)] mb-2">
            <Wifi size={18} />
            <h3 className="text-xs font-black uppercase tracking-widest">Hardware Configuration</h3>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-[var(--text-1)]">
                <Wifi size={120} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-4">
                <div>
                <label className="block text-[10px] font-black text-[var(--text-3)] uppercase tracking-widest mb-2 px-1">Router IP / URL</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-4)] group-focus-within:text-indigo-500 transition-colors">
                    <Globe size={18} />
                    </div>
                    <input
                    type="text"
                    required
                    value={formData.routerUrl}
                    onChange={(e) => setFormData({ ...formData, routerUrl: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                    placeholder="http://192.168.1.1"
                    />
                </div>
                </div>

                <div>
                <label className="block text-[10px] font-black text-[var(--text-3)] uppercase tracking-widest mb-2 px-1">Admin Username</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-4)] group-focus-within:text-indigo-500 transition-colors">
                    <Shield size={18} />
                    </div>
                    <input
                    type="text"
                    required
                    value={formData.routerUsername}
                    onChange={(e) => setFormData({ ...formData, routerUsername: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                    placeholder="admin"
                    />
                </div>
                </div>

                <div>
                <label className="block text-[10px] font-black text-[var(--text-3)] uppercase tracking-widest mb-2 px-1">Admin Password</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-4)] group-focus-within:text-indigo-500 transition-colors">
                    <Shield size={18} />
                    </div>
                    <input
                    type="password"
                    value={formData.routerPassword}
                    onChange={(e) => setFormData({ ...formData, routerPassword: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                    placeholder="Leave empty to keep current"
                    />
                </div>
                </div>
            </div>

            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 flex gap-4 text-xs text-indigo-500 leading-relaxed shadow-sm">
                <Info size={20} className="shrink-0 opacity-70" />
                <p>These credentials are used to fetch real-time telemetry and manage MAC filtering rules.</p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl py-4 font-black transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
                {loading ? (
                <Loader2 className="animate-spin" size={20} />
                ) : (
                <>
                    <Save size={20} />
                    Save Infrastructure config
                </>
                )}
            </button>
            </form>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Appearance Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1 text-[var(--text-3)]">
                <Palette size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Appearance</h3>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between p-4 bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl hover:border-indigo-500/30 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-[var(--text-1)] capitalize">{theme} Mode</p>
                            <p className="text-[10px] text-[var(--text-3)] font-medium tracking-tight">Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
                        </div>
                    </div>
                </button>
            </div>
          </section>

          {/* Account Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 px-1 text-[var(--text-3)]">
                <UserIcon size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">Account</h3>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl hover:border-rose-500/30 transition-all group"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                            <LogOut size={20} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-rose-500">Logout</p>
                            <p className="text-[10px] text-rose-500/60 font-medium tracking-tight">End current session</p>
                        </div>
                    </div>
                </button>
            </div>
          </section>
      </div>
    </div>
  );
}
