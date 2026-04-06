import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div
      style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-1)' }}
      className="flex min-h-screen font-sans transition-colors duration-300"
    >
      <Sidebar />
      <main className="flex-1 w-full pb-20 md:pb-0 md:ml-64 overflow-x-hidden">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
