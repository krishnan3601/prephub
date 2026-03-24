import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Progress() {
  const [userData, setUserData] = useState(null);
  const [bookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchQuestions();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/questions');
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const bookmarkedQuestions = questions.filter(q => bookmarks.includes(q._id));

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>My Progress & Bookmarks</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Question Progress</h3>
          {userData && userData.progress && userData.progress.length > 0 ? (
            userData.progress.map(p => (
              <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>{p.questionId?.title || 'Unknown Question'}</span>
                <span className={`badge ${p.status === 'solved' ? 'easy' : 'medium'}`}>{p.status}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>You haven't attempted any questions yet.</p>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Bookmarked ({bookmarkedQuestions.length})</h3>
          {bookmarkedQuestions.length > 0 ? (
            bookmarkedQuestions.map(q => (
              <div key={q._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>{q.title}</span>
                <span className={`badge ${q.difficulty}`}>{q.difficulty}</span>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>No bookmarks found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
