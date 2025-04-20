import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/fundraisers">Fundraisers</Link>
        {user?.role === 'admin' && <Link to="/makeadmin">Make Admin</Link>}
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
  );
}

export default Navbar;
