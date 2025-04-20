import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

function Layout() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/protected', { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      <Navbar user={user} setUser={setUser} />
      <main className="p-6">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

export default Layout;
