import { useEffect, useState } from "react";
import axios from "axios";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/admin", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "client" : "admin";
    try {
      await axios.patch(`http://localhost:5000/users/admin/${userId}`, { role: newRole }, {
        withCredentials: true,
      });
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      console.error("Failed to update user role", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🧍 Manage Users</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded shadow bg-white flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.full_name}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
              <p className="text-xs text-gray-400">ID: {user.id}</p>
            </div>
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
              onClick={() => toggleRole(user.id, user.role)}
            >
              Make {user.role === "admin" ? "Client" : "Admin"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageUsers;
