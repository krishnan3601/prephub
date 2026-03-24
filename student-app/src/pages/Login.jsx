import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      
      if (data.role === 'admin') {
        setError('Administrators must use the admin dashboard.');
      } else {
        navigate('/questions');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="card" onSubmit={handleLogin} style={{ width: '350px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Student Gateway</h2>
        {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        <input 
          type="text" 
          placeholder="Username" 
          className="input-field"
          value={username} onChange={e => setUsername(e.target.value)} 
          required 
        />
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            className="input-field"
            style={{ marginBottom: 0 }}
            value={password} onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button type="submit" className="btn" style={{ width: '100%', marginBottom: '1rem' }}>Log In</button>
        <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
