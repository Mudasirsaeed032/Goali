import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/protected', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/">Home</Link>
          <Link to="/fundraisers">Fundraisers</Link>
          {user?.role === 'admin' && <Link to="/makeadmin">Make Admin</Link>}
          {/* You’ll add /admin route later */}
        </div>
        <div className="space-x-4">
          {user ? (
            <>
              <span>{user.full_name}</span>
              <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-6">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default Layout;
