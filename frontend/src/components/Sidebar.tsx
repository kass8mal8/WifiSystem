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
        className="hidden md:flex flex-col w-64 border-r h-screen fixed top-0 left-0 z-40 transition-colors duration-300"
      >
        {/* Logo */}
        <div style={{ borderColor: 'var(--border)' }} className="p-6 flex items-center gap-3 border-b">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20">
            <Wifi size={22} className="text-white" />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
            WiFiMaster
          </h1>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 mt-2">
          <div style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-solid)' }} className="flex items-center gap-3 p-3 rounded-xl border">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--text-3)] font-medium">Administrator</p>
              <p className="text-sm text-[var(--text-1)] font-semibold truncate">{user?.username || 'Admin'}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20'
                    : 'hover:bg-[var(--hover-bg)] text-[var(--text-2)] hover:text-[var(--text-1)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-indigo-400' : ''}>{item.icon}</span>
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Actions */}
        <div style={{ borderColor: 'var(--border)' }} className="p-4 border-t space-y-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-solid)', color: 'var(--text-2)' }}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-200 hover:border-indigo-500/40 hover:text-indigo-400 group"
          >
            <span className="group-hover:rotate-12 transition-transform duration-300">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </span>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <span className="ml-auto">
              <span
                className={`w-7 h-3.5 rounded-full flex items-center px-0.5 transition-all duration-300 ${
                  theme === 'light' ? 'bg-indigo-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <span className="w-2.5 h-2.5 bg-white rounded-full shadow-sm" />
              </span>
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ───────────────────────────── */}
      <div
        style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border)' }}
        className="md:hidden fixed bottom-0 left-0 w-full backdrop-blur-xl border-t shadow-[0_-4px_30px_rgba(0,0,0,0.15)] z-50 transition-colors duration-300"
      >
        <nav className="flex justify-around items-center p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                  isActive ? 'text-indigo-400' : 'text-[var(--text-3)] hover:text-[var(--text-1)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-full mb-0.5 ${isActive ? 'bg-indigo-500/15' : ''}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Mobile Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center p-2 rounded-xl min-w-[60px] text-rose-400 transition-all"
          >
            <div className="p-1.5 rounded-full mb-0.5">
              <LogOut size={20} />
            </div>
            <span className="text-[10px] font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
