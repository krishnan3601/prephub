import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/leaderboard`);
      setLeaders(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Top Performers</h2>
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        {leaders.map((l, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: index !== leaders.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
            <span style={{ fontWeight: '600', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: index < 3 ? '#fbbf24' : 'var(--text-muted)' }}>#{index + 1}</span> 
              {l.username}
            </span>
            <span className="badge easy" style={{ fontSize: '1rem', padding: '0.4rem 0.8rem' }}>{l.solvedCount} Solved</span>
          </div>
        ))}
        {leaders.length === 0 && <p style={{color: 'var(--text-muted)', textAlign: 'center'}}>No leaderboard data available yet.</p>}
      </div>
    </div>
  );
}
