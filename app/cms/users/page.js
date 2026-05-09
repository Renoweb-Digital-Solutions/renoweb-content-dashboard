'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { isAdmin } from '@/lib/auth-utils';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function UsersManagementPage() {
  // Context Props: Coming directly from `lib/AuthContext.js` -> `useAuth()` hook.
  // `user` is the hydrated Firestore document passed down from the server layout (`app/cms/layout.js`).
  // `authReady` ensures we don't query Firestore until the Client SDK is fully initialized.
  const { user, authReady } = useAuth();
  
  // Local State: List of users fetched from Firestore
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add User State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('writer');
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState('');
  
  // Delete User State
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Utility function from `lib/auth-utils.js` to parse role permissions
  const hasAccess = isAdmin(user);

  // Initial Data Fetch
  // WHY: We wait for `authReady` to be true so Firestore Security Rules don't block our read request.
  useEffect(() => {
    if (hasAccess && user && authReady) {
      fetchUsers();
    } else if (!loading && !hasAccess) {
      setLoading(false);
    }
  }, [hasAccess, user, authReady, loading]);

  /**
   * fetchUsers
   * Uses Firebase Client SDK to query the 'users' collection.
   * Only works if the user is an Admin, as dictated by Firestore Security Rules.
   */
  const fetchUsers = async () => {
    try {
      const usersCol = collection(db, 'users');
      const userSnapshot = await getDocs(usersCol);
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userList);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  /**
   * confirmDeleteUser
   * Calls our secure backend API route `/api/auth/users/delete`
   * WHY: Client SDK cannot hard-delete users from Firebase Auth. It requires Admin SDK.
   */
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    
    try {
      const res = await fetch('/api/auth/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToDelete.id }) // Payload sent to route.js
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      
      // Update local state without refreshing the page
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null); // Close the modal
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err.message || 'Error deleting user');
    } finally {
      setIsDeleting(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Also update permissions based on new role
      const { DEFAULT_PERMISSIONS } = await import('@/lib/auth-utils');
      
      await updateDoc(userRef, {
        role: newRole,
        permissions: DEFAULT_PERMISSIONS[newRole]
      });
      
      // Update local state
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole, permissions: DEFAULT_PERMISSIONS[newRole] } : u));
    } catch (err) {
      console.error('Failed to update role:', err);
      alert('Error updating user role');
    }
  };

  /**
   * handleAddUser
   * Calls secure backend API route `/api/auth/users/create`
   * WHY: Creating an account client-side forces you to log into it instantly. 
   * The backend Admin SDK prevents this behavior and allows silent creation.
   */
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddError('');
    setIsAdding(true);
    
    try {
      const res = await fetch('/api/auth/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Append new user to local array and reset modal states
      setUsers([...users, data.user]);
      setShowAddModal(false);
      setNewEmail('');
      setNewPassword('');
      setNewRole('writer');
    } catch (err) {
      setAddError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (!hasAccess) {
    return (
      <div className="p-8 text-center bg-black min-h-screen text-white pt-20">
        <div className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-500 mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400">You do not have permission to view the user management dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">User Management</h1>
            <p className="text-gray-400 text-sm">Manage CMS access, roles, and permissions.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors border border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        ) : (
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Joined</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-blue-400 font-bold mr-4">
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{u.email}</div>
                            <div className="text-xs text-gray-500">{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          disabled={u.id === user.uid} // Can't change own role easily
                          className="bg-gray-950 border border-gray-700 text-white text-xs rounded-lg block p-2 outline-none focus:border-blue-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="writer">Writer</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setUserToDelete(u)}
                          disabled={u.id === user.uid} // Can't delete self
                          className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Add New User</h2>
            <form onSubmit={handleAddUser} className="space-y-5">
              {addError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{addError}</div>}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="user@renoweb.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Role</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-sm appearance-none">
                  <option value="writer">Writer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 transition-colors">Cancel</button>
                <button type="submit" disabled={isAdding} className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] disabled:opacity-50 flex justify-center items-center">
                  {isAdding ? (
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Delete User?</h2>
            <p className="text-gray-400 text-sm mb-8">Are you sure you want to delete <span className="font-semibold text-white">{userToDelete.email}</span>? This action cannot be undone.</p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteUser}
                disabled={isDeleting}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
