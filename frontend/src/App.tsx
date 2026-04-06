import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { fetchUsers, deleteUser, updateUser } from './api';
import type { WifiUser } from './api';
import { Toaster, toast } from 'react-hot-toast';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import AddUserPage from './pages/AddUserPage';
import ReportsPage from './pages/ReportsPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ConfirmModal from './components/ConfirmModal';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
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
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
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

  const handleDeleteClick = (id: string) => {
    setUserToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter(u => u._id !== userToDelete));
      toast.success('User access revoked');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete user');
    } finally {
      setUserToDelete(null);
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
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage users={users} loading={loading} />} />
            <Route path="users" element={<UsersPage users={users} loading={loading} onDelete={handleDeleteClick} onUpdate={handleUserUpdate} onUserAdded={handleUserAdded} />} />
            <Route path="reports" element={<ReportsPage users={users} loading={loading} />} />
            <Route path="add-user" element={<AddUserPage onUserAdded={handleUserAdded} />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <ConfirmModal 
        isOpen={isConfirmOpen}
        title="Revoke Access"
        message="Are you sure you want to revoke this user's access? They will be immediately disconnected from the WiFi."
        onConfirm={confirmDelete}
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
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
