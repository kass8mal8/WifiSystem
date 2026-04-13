import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { fetchUsers, revokeUser, updateUser } from './api';
import type { WifiUser } from './api';
import { Toaster, toast } from 'react-hot-toast';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import AddUserPage from './pages/AddUserPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SettingsPage from './pages/SettingsPage';
import ConfirmModal from './components/ConfirmModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-16 h-16 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
           <div className="w-full h-full bg-gradient-to-tr from-indigo-500/20 to-transparent animate-pulse delay-75"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
           </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">System</span>
        <span className="text-xs font-medium text-slate-500">Initializing secure link...</span>
      </div>
    </div>
  );
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppContent() {
  const [users, setUsers] = useState<WifiUser[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const handleUserAdded = (newUser: WifiUser) => {
    setUsers([newUser, ...users]);
  };

  const handleUserUpdate = async (id: string, updatedData: Partial<WifiUser>) => {
    try {
      const updatedUser = await updateUser(id, updatedData);
      setUsers(prev => prev.map(u => u._id === id ? updatedUser : u));
      toast.success('Subscription renewed successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update user');
    }
  };

  const handleRevokeClick = (id: string) => {
    setUserToRevoke(id);
    setIsConfirmOpen(true);
  };

  const confirmRevoke = async () => {
    if (!userToRevoke) return;
    try {
      const updatedUser = await revokeUser(userToRevoke);
      setUsers(prev => prev.map(u => u._id === userToRevoke ? updatedUser : u));
      toast.success('User access revoked');
    } catch (error) {
      console.error(error);
      toast.error('Failed to revoke user access');
    } finally {
      setUserToRevoke(null);
      setIsConfirmOpen(false);
    }
  };

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-slate-800 text-white border border-slate-700 rounded-xl',
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      {/* Background glow effects remain global */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      
      <div className="relative z-10">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage users={users} loading={loading} />} />
            <Route path="users" element={<UsersPage users={users} loading={loading} onRevoke={handleRevokeClick} onUpdate={handleUserUpdate} onUserAdded={handleUserAdded} />} />
            <Route path="reports" element={<ReportsPage users={users} loading={loading} />} />
            <Route path="add-user" element={<AddUserPage onUserAdded={handleUserAdded} />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Revoke Access"
        message="Are you sure you want to revoke this user's access? They will be immediately disconnected from the WiFi."
        onConfirm={confirmRevoke}
        onClose={() => setIsConfirmOpen(false)}
        confirmText="Confirm"
        type="danger"
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
