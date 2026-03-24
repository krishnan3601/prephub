import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('bookmarks') || '[]'));
  const missTracked = useRef(new Set()); // track which zero-result terms we've already reported this session

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`);
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/submit`, { questionId: id, status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(`Marked as ${status}`);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleBookmark = (id) => {
    let updated;
    if (bookmarks.includes(id)) {
      updated = bookmarks.filter(b => b !== id);
    } else {
      updated = [...bookmarks, id];
    }
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  // Apply search + filter
  const filtered = questions.filter(q => {
    const matchSearch = q.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || q.difficulty === filter;
    return matchSearch && matchFilter;
  });

  // If search is >= 2 chars and there are 0 results, silently report to backend once per term
  useEffect(() => {
    const term = search.trim();
    if (term.length >= 2 && filtered.length === 0 && !missTracked.current.has(term.toLowerCase())) {
      missTracked.current.add(term.toLowerCase());
      const token = localStorage.getItem('token');
      if (token) {
        axios.post(`${import.meta.env.VITE_API_URL}/api/trackSearch`, { topic: term }, {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {}); // silent — don't disrupt UX
      }
    }
  }, [search, filtered.length]);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Practice Questions</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search questions by title..."
          className="input-field"
          style={{ marginBottom: 0, flex: 1 }}
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <select className="input-field" style={{ width: '150px', marginBottom: 0 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        {filtered.map(q => (
          <div key={q._id} className="question-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {q.isImportant && <span style={{color: '#f59e0b'}} title="Important Topic">★</span>}
                  {q.title}
                </h3>
                <span className={`badge ${q.difficulty}`}>{q.difficulty}</span>
              </div>
              <button
                onClick={() => toggleBookmark(q._id)}
                style={{ background: 'none', border: 'none', color: bookmarks.includes(q._id) ? '#fbbf24' : 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Bookmark"
              >
                {bookmarks.includes(q._id) ? '★' : '☆'}
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0' }}>{q.description}</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={() => handleStatusUpdate(q._id, 'attempted')} style={{background: '#334155', padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Mark Attempted</button>
              <button className="btn" onClick={() => handleStatusUpdate(q._id, 'solved')} style={{background: '#10b981', padding: '0.4rem 0.8rem', fontSize: '0.8rem'}}>Mark Solved</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && search.length > 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1.2rem' }}>No questions found for "{search}"</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>We've noted this — if more students search for this, an admin will be notified!</p>
          </div>
        )}
        {filtered.length === 0 && search.length === 0 && (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No questions available yet.</p>
        )}
      </div>
    </div>
  );
}
