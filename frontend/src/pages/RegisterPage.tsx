import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';
import { toast } from 'react-hot-toast';
import { User, Mail, Lock, Globe, Shield, Wifi, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    routerUrl: 'http://192.168.1.1',
    routerUsername: 'admin',
    routerPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all account fields.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Check connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-app)] p-4 font-inter text-[var(--text-1)] overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      
      <div className="w-full max-w-lg z-10 transition-all duration-500">
        <div className="bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border)] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/login" className="p-2 rounded-xl bg-[var(--bg-input)] text-[var(--text-3)] hover:text-indigo-500 transition-all border border-[var(--border)] hover:border-indigo-500/30">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Self Signup</span>
              <span className="text-[8px] font-bold text-[var(--text-4)] uppercase tracking-tighter">Tenant Cloud Setup</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-4 border border-indigo-500/20 shadow-sm">
              <Wifi size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-1)]">
              {step === 1 ? 'Create Account' : 'Router Setup'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-5 animate-in slide-in-from-left-4 fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-2)] ml-1">Name</label>
                    <div className="relative group/field">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] group-focus-within/field:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-[var(--text-4)]"
                        placeholder="Full Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-2)] ml-1">Email</label>
                    <div className="relative group/field">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] group-focus-within/field:text-indigo-500 transition-colors" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-[var(--text-4)]"
                        placeholder="name@company.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-2)] ml-1">Password</label>
                  <div className="relative group/field">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] group-focus-within/field:text-indigo-500 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-[var(--text-4)]"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-2)] ml-1">Router IP</label>
                    <div className="relative group/field">
                      <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-4)] group-focus-within/field:text-indigo-500 transition-colors" />
                      <input
                        type="text"
                        name="routerUrl"
                        value={formData.routerUrl}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 pl-12 pr-4 text-[var(--text-2)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all placeholder:text-[var(--text-4)]"
                        placeholder="http://192.168.1.1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-2)] ml-1">Router Username</label>
                      <input
                        type="text"
                        name="routerUsername"
                        value={formData.routerUsername}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 px-5 text-[var(--text-2)] focus:outline-none focus:border-indigo-500/50 transition-all shadow-sm"
                        placeholder="admin"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[var(--text-2)] ml-1">Router Password</label>
                      <input
                        type="password"
                        name="routerPassword"
                        value={formData.routerPassword}
                        onChange={handleChange}
                        className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-2xl py-4 px-5 text-[var(--text-2)] focus:outline-none focus:border-indigo-500/50 transition-all shadow-sm"
                        placeholder="Required"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-[var(--bg-input)] hover:bg-[var(--bg-hover)] text-[var(--text-2)] font-semibold py-3.5 rounded-xl transition-all border border-[var(--border)] flex items-center justify-center"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Provisioning...
                      </>
                    ) : (
                      'Complete Setup'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="mt-10 text-center text-[var(--text-3)] text-xs font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-bold transition-colors">
              Access Cloud Portal
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
