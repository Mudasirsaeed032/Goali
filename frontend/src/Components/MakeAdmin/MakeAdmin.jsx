import { useState } from 'react';
import axios from 'axios';

function MakeAdmin() {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePromote = async () => {
    setMessage('');
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:5000/auth/make-admin',
        { user_id: userId },
        { withCredentials: true }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to promote user');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Promote User to Admin</h2>

      <input
        type="text"
        placeholder="Enter user ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handlePromote}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Promote
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}

export default MakeAdmin;
