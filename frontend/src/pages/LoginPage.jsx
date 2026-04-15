import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a5c2a,#2d8a47)' },
  card: { background: '#fff', borderRadius: 12, padding: 40, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  logo: { textAlign: 'center', fontSize: 40, marginBottom: 8 },
  title: { textAlign: 'center', color: '#1a5c2a', fontSize: 22, fontWeight: 700, marginBottom: 4 },
  sub: { textAlign: 'center', color: '#666', fontSize: 14, marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, outline: 'none', marginBottom: 16 },
  btn: { width: '100%', padding: '12px', background: '#1a5c2a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 4 },
  err: { background: '#f8d7da', color: '#58151c', border: '1px solid #dc3545', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' },
};

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email) { setError('Email is required'); return; }
    if (!form.password) { setError('Password is required'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>🌿</div>
        <h1 style={s.title}>Campus Biodiversity Portal</h1>
        <p style={s.sub}>Wildlife & Plantlife Record Management</p>

        {error && <div style={s.err} role="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={s.label}>Email</label>
          <input
            style={s.input}
            type="email"
            placeholder="you@campus.edu"
            value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
            aria-label="email"
          />
          <label style={s.label}>Password</label>
          <input
            style={s.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
            aria-label="password"
          />
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p style={s.footer}>
          No account? <Link to="/register" style={{ color: '#1a5c2a' }}>Register here</Link>
        </p>
        <p style={{ ...s.footer, marginTop: 8, fontSize: 11, color: '#999' }}>
          Demo: admin@campus.edu / Admin@123
        </p>
      </div>
    </div>
  );
}
