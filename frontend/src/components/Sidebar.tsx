import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Wifi, BarChart3, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Users',     path: '/users',     icon: <Users size={20} /> },
    { name: 'Reports',   path: '/reports',   icon: <BarChart3 size={20} /> },
    { name: 'Settings',  path: '/settings',  icon: <Settings size={20} /> },
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
              <p className="text-base text-[var(--text-1)] font-bold truncate">{user?.name || 'SuperAdmin'}</p>
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
      </div>

      {/* ── Mobile Bottom Nav ───────────────────────────── */}
      <div className="md:hidden fixed bottom-5 left-4 right-4 z-50 flex justify-center pb-safe pointer-events-none">
        <nav 
          style={{ backgroundColor: 'var(--bg-nav)' }}
          className="flex justify-around items-center px-1.5 py-1.5 backdrop-blur-3xl border border-[var(--border)] rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.5)] w-full max-w-[400px] pointer-events-auto"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 transition-all duration-300 min-w-[50px] flex-1 ${
                  isActive ? 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] -translate-y-1' : 'text-[var(--text-3)] hover:text-[var(--text-1)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2.5 rounded-[1.25rem] mb-1 transition-all duration-300 ${isActive ? 'bg-indigo-500/20 shadow-inner border border-indigo-500/20 scale-110' : ''}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
