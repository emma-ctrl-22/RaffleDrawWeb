import React, { useState } from 'react';

const fakeUsers = [
  { id: 1, name: 'John Doe', role: 'Admin', active: true },
  { id: 2, name: 'Jane Smith', role: 'User', active: true },
  { id: 3, name: 'Sam Johnson', role: 'User', active: true },
];

const Settings = () => {
  const [users, setUsers] = useState(fakeUsers);
  const [newUser, setNewUser] = useState({ name: '', role: 'User' ,passowrd:""});

  const handleAddUser = () => {
    if (newUser.name) {
      setUsers([...users, { id: users.length + 1, ...newUser, active: true }]);
      setNewUser({ name: '', role: 'User' });
    }
  };

  const handleDeactivateUser = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, active: false } : user));
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
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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
            <option value="User">User</option>
            <option value="Admin">Admin</option>
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
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2  border-b">Username</th>
              <th className="py-2  border-b">Role</th>
              <th className="py-2  border-b">Status</th>
              <th className="py-2  border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={user.active ? '' : 'bg-gray-100'}>
                <td className="py-2 px-4 border-b">{user.name}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">{user.active ? 'Active' : 'Inactive'}</td>
                <td className="py-2 px-4 border-b">
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
