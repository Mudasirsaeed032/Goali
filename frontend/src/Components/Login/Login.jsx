import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/login',
        { email, password },
        { withCredentials: true }
      );
      alert('Logged in successfully!');
    } catch (err) {
      console.error('[Login Error Frontend]', err);
      const msg = err.response?.data?.error || 'Login failed (unknown reason)';
      alert(msg);
    }
    navigate('/');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input className="w-full mb-2 p-2 border" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-2 p-2 border" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full bg-green-600 text-white p-2 rounded" onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
