import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Questions from './pages/Questions';
import Leaderboard from './pages/Leaderboard';
import Progress from './pages/Progress';
import './index.css';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  if (!token) return null;

  return (
    <nav className="navbar">
      <h2>PrepHub Student</h2>
      <div className="nav-links">
        <Link to="/questions">Questions</Link>
        <Link to="/progress">My Progress</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <button onClick={handleLogout} className="btn" style={{padding: '0.4rem 1rem'}}>Logout</button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
