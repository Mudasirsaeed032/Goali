import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/protected', {
      withCredentials: true, // 👈 This is required!
      headers: {'Cache-Control': 'no-cache'}
    })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        console.error('User not authorized:', err);
        setUser(null);
      });
  }, []);



  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Welcome to GOALI</h1>
      {user ? (
        <div>
          <p>Logged in as: <strong>{user.email}</strong></p>
          <p>Full Name: <strong>{user.full_name}</strong></p>
          <p>User Role: <strong>{user.role}</strong></p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default Home;
