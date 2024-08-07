import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', role: 'user', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://raffledrawapi.onrender.com/users/get-all-users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const handleAddUser = async () => {
    if (newUser.username && newUser.password) {
      try {
        await axios.post('https://raffledrawapi.onrender.com/users/create-new-user', newUser);
        toast.success('User added successfully');
        fetchUsers(); // Refresh the user list
        setNewUser({ username: '', role: 'user', password: '' });
      } catch (error) {
        console.error('Error adding user:', error);
        toast.error('Failed to add user');
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  const handleDeactivateUser = async (id) => {
    try {
      await axios.put(`https://raffledrawapi.onrender.com/users/deactivate/${id}`);
      toast.success('User deactivated successfully');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error deactivating user:', error);
      toast.error('Failed to deactivate user');
    }
  };

  return (
    <div className="p-4 bg-white text-gray-800">
      <h1 className="font-bold text-2xl mb-4">Settings</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Add New User</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
          <button
            onClick={handleAddUser}
            className="bg-yellow-500 text-black px-4 py-2 rounded"
          >
            Add User
          </button>
        </div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">User List</h2>
        <table className="min-w-full bg-white border border-gray-200 border-collapse">
          <thead>
          <tr className="bg-gray-100">
              <th className="py-2 px-4 border border-gray-200">Username</th>
              <th className="py-2 px-4 border border-gray-200">Role</th>
              <th className="py-2 px-4 border border-gray-200">Status</th>
              <th className="py-2 px-4 border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.active ? '' : 'bg-white'}>
                <td className="py-2 px-4 border border-gray-200">{user.username}</td>
                <td className="py-2 px-4 border border-gray-200">{user.role}</td>
                <td className="py-2 px-4 border border-gray-200">{user.active ? 'Active' : 'Active'}</td>
                <td className="py-2 px-4 border border-gray-200">
                  {user.active && (
                    <button
                      onClick={() => handleDeactivateUser(user.id)}
                      className="bg-yellow-500 text-black px-4 py-2 rounded"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;