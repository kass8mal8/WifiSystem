import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Wifi, Sun, Moon, BarChart3, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Users',     path: '/users',     icon: <Users size={20} /> },
    { name: 'Reports',   path: '/reports',   icon: <BarChart3 size={20} /> },
  ];

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <div
        style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border)' }}
        className="hidden md:flex flex-col w-56 border-r h-screen fixed top-0 left-0 z-40 transition-colors duration-300"
      >
        {/* Logo */}
        <div style={{ borderColor: 'var(--border)' }} className="p-5 flex items-center gap-3 border-b">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <Wifi size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent tracking-tight">
            WiFiMaster
          </h1>
        </div>

        {/* User Info */}
        <div className="px-5 py-5 mt-2">
          <div style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-solid)' }} className="flex items-center gap-3.5 p-4 rounded-xl border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--text-3)] font-black uppercase tracking-widest opacity-60">Admin</p>
              <p className="text-base text-[var(--text-1)] font-bold truncate">{user?.username || 'SuperAdmin'}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                   isActive
                    ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-sm'
                    : 'bg-transparent border-transparent text-[var(--text-2)] hover:text-[var(--text-1)] hover:bg-[var(--hover-bg)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-indigo-400 scale-110' : 'opacity-70 group-hover:opacity-100 transition-all'}>{item.icon}</span>
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div style={{ borderColor: 'var(--border)' }} className="p-5 border-t space-y-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-solid)', color: 'var(--text-2)' }}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400 group"
          >
            <span className="group-hover:rotate-12 transition-transform duration-300">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </span>
            {theme === 'dark' ? 'Light' : 'Dark'}
            <span className="ml-auto">
              <span
                className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                  theme === 'light' ? 'bg-indigo-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-3 h-3 bg-white rounded-full shadow-sm" />
              </span>
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ───────────────────────────── */}
      <div
        style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border)' }}
        className="md:hidden fixed bottom-0 left-0 w-full backdrop-blur-2xl border-t border-white/5 shadow-[0_-8px_40px_rgba(0,0,0,0.4)] z-50 transition-colors duration-300"
      >
        <nav className="flex justify-around items-center px-2 py-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-2xl transition-all duration-200 min-w-[70px] ${
                  isActive ? 'text-indigo-400' : 'text-[var(--text-3)] hover:text-[var(--text-1)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl mb-1 ${isActive ? 'bg-indigo-500/15' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center p-2 rounded-2xl min-w-[70px] text-[var(--text-3)] transition-all"
          >
            <div className={`p-2 rounded-xl mb-1 ${theme === 'light' ? 'text-amber-500' : 'text-indigo-400'}`}>
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </div>
            <span className="text-xs font-black uppercase tracking-tight">Theme</span>
          </button>

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-2xl min-w-[70px] text-rose-400 transition-all"
          >
            <div className="p-2 rounded-xl mb-1">
              <LogOut size={22} />
            </div>
            <span className="text-xs font-black uppercase tracking-tight">Exit</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
