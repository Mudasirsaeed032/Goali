import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    const userId = data.user?.id;

    // Optional: if email confirmation is required, wait until confirmed
    if (userId) {
      // Create user record in DB
      await axios.post('http://localhost:5000/auth/register-user', {
        id: userId,
        full_name: fullName,
        role: 'client'
      });
    }

    alert('Signup successful!');
    navigate('/login');
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input
        className="w-full mb-2 p-2 border"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        className="w-full mb-2 p-2 border"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="w-full bg-blue-600 text-white p-2 rounded" onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
}

export default Signup;
