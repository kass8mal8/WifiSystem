import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api';
import { Lock, Mail, Wifi, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const data = await loginUser({ email, password });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name || 'Admin'}!`);
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-app)] relative overflow-hidden font-outfit px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(129,140,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(129,140,248,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm animate-in zoom-in-95 duration-500">
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 shadow-sm border border-indigo-500/20 mb-4">
            <Wifi className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-1)] tracking-tight">Welcome Back</h1>
          <p className="text-[var(--text-3)] mt-1.5 text-sm">Sign in to manage your network.</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 md:p-8 rounded-3xl shadow-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[var(--text-2)] ml-1">Email</label>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-4)] group-focus-within/field:text-indigo-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all text-sm"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-medium text-[var(--text-2)]">Password</label>
              </div>
              <div className="relative group/field">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--text-4)] group-focus-within/field:text-indigo-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border)] rounded-xl py-3 pl-11 pr-4 text-[var(--text-1)] placeholder:text-[var(--text-4)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all text-sm font-mono tracking-wider"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
            >
              {isLoggingIn ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center flex flex-col items-center gap-4">
            <p className="text-[var(--text-3)] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
