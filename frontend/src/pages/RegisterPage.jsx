import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#1a5c2a,#2d8a47)' },
  card: { background: '#fff', borderRadius: 12, padding: 40, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  title: { textAlign: 'center', color: '#1a5c2a', fontSize: 22, fontWeight: 700, marginBottom: 24 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  hint: { fontSize: 11, color: '#888', marginTop: -12, marginBottom: 14 },
  btn: { width: '100%', padding: 12, background: '#1a5c2a', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  err: { background: '#f8d7da', color: '#58151c', border: '1px solid #dc3545', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 13, color: '#666' },
};

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>🌿 Create Account</h1>
        {error && <div style={s.err}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <label style={s.label}>Full Name</label>
          <input style={s.input} type="text" placeholder="Your full name" value={form.full_name}
            onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          <label style={s.label}>Email</label>
          <input style={s.input} type="email" placeholder="you@campus.edu" value={form.email}
            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" placeholder="Min 6 characters" value={form.password}
            onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />
          <p style={s.hint}>Role: Viewer (default). Admin can promote your role later.</p>
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create Account'}
          </button>
        </form>
        <p style={s.footer}>
          Have an account? <Link to="/login" style={{ color: '#1a5c2a' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
