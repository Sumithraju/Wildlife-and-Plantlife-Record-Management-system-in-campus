import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const styles = {
  nav: { background: '#1a5c2a', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  brand: { color: '#fff', fontWeight: 700, fontSize: 18, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 },
  links: { display: 'flex', alignItems: 'center', gap: 4 },
  link: { color: '#d4edda', textDecoration: 'none', padding: '6px 14px', borderRadius: 6, fontSize: 14, fontWeight: 500, transition: 'background 0.2s' },
  activeLink: { background: 'rgba(255,255,255,0.2)', color: '#fff' },
  logoutBtn: { background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
};

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const linkStyle = (path) => pathname.startsWith(path)
    ? { ...styles.link, ...styles.activeLink }
    : styles.link;

  const handleLogout = () => { logout(); navigate('/login'); };

  if (!user) return null;

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.brand}>
        🌿 Campus Biodiversity Portal
      </Link>
      <div style={styles.links}>
        <Link to="/wildlife" style={linkStyle('/wildlife')}>Wildlife</Link>
        <Link to="/plants" style={linkStyle('/plants')}>Plants</Link>
        <Link to="/map" style={linkStyle('/map')}>Map</Link>
        <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
        {isAdmin && <Link to="/admin/users" style={linkStyle('/admin')}>Users</Link>}
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </div>
    </nav>
  );
}
