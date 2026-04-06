import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchUsers, deleteUser, updateUser } from './api';
import type { WifiUser } from './api';
import { Toaster, toast } from 'react-hot-toast';

import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import AddUserPage from './pages/AddUserPage';
import ReportsPage from './pages/ReportsPage';
import ConfirmModal from './components/ConfirmModal';

function App() {
  const [users, setUsers] = useState<WifiUser[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    loadUsers();
  }, []);

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
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
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
          <Route path="/" element={<Layout />}>
            <Route index element={<DashboardPage users={users} />} />
            <Route path="reports" element={<ReportsPage users={users} onDelete={handleDeleteClick} onUpdate={handleUserUpdate} />} />
            <Route path="add-user" element={<AddUserPage onUserAdded={handleUserAdded} />} />
          </Route>
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
    </BrowserRouter>
  );
}

export default App;
