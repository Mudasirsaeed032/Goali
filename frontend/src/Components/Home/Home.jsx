import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/protected', {
      withCredentials: true, // 👈 This is required!
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
        <p>Logged in as: <strong>{user.email}</strong></p>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

export default Home;
