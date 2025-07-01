import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authThunks';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
  .unwrap()
  .then((res) => {
    console.log("Login success:", res);
    navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
  })
  .catch((err) => {
    console.error("Login failed:", err); // 🔍 check what you get here
    // toast.error(err); // optional
  });

  };

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin');
    else if (user?.role === 'employee') navigate('/dashboard');
  }, [user, navigate]);

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Login;
