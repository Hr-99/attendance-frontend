import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Register() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/auth/register', form);
      setMessage('User registered successfully!');
      setForm({ name: '', email: '', password: '', role: 'employee' });
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (

    <div className='d-flex justify-content-center align-items-center vh-100 vw-100'>

    <div  className="">
      <div className='d-flex justify-content-between gap-2'>
        <h2 style={{fontSize:"22px"}}>Register New User</h2>
        
        
        <button type="button" style={{fontSize:"16px"}} onClick={() => navigate('/admin')}>
          ← Back to Dashboard
        </button>
      </div>
      <hr />
      <div className='d-flex justify-content-center w-100'>

      <form onSubmit={handleSubmit}>
        <div className=''>

        <div>
          <label>Name:</label> <br />
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label> <br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password</label> <br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Role</label> <br />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        </div>

        <br />
        <button className='w-100' type="submit">Register</button>
      </form>
      </div>

      {message && <p className='text-center' style={{ color: 'green' }}>{message}</p>}
      {error && <p className='text-center' style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>

  );
}

export default Register;
