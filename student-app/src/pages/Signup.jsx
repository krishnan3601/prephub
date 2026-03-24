import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/register`, { 
        username, 
        password,
        role: 'student'
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      
      navigate('/questions');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={handleSignup} style={{ width: '350px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Student Sign Up</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        <input 
          type="text" 
          placeholder="Choose Username" 
          className="input-field"
          value={username} onChange={e => setUsername(e.target.value)} 
          required 
        />
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Create Password" 
            className="input-field"
            style={{ marginBottom: 0 }}
            value={password} onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Create Account</button>
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600', textDecoration: 'none' }}>Log In</Link>
        </p>
      </form>
    </div>
  );
}
