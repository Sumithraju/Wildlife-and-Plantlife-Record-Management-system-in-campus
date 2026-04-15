import { useState, useEffect } from 'react';
import api from '../api/axios';

const s = {
  page: { padding: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a5c2a', marginBottom: 20 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#1a5c2a', color: '#fff', padding: '12px 16px', textAlign: 'left', fontSize: 13 },
  td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 14 },
  select: { padding: '6px 10px', border: '1.5px solid #ddd', borderRadius: 6, fontSize: 13 },
  deactivateBtn: { padding: '5px 12px', borderRadius: 6, background: '#f8d7da', color: '#58151c', border: 'none', cursor: 'pointer', fontSize: 12 },
  badge: (active) => ({ padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, background: active ? '#d1e7dd' : '#f8d7da', color: active ? '#0a3622' : '#58151c' }),
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);

  const load = () =>
    api.get('/users?limit=50').then(({ data }) => { setUsers(data.users); setTotal(data.total); });

  useEffect(() => { load(); }, []);

  const handleRole = async (id, role) => {
    await api.patch(`/users/${id}/role`, { role });
    setUsers(us => us.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Deactivate this user?')) return;
    await api.delete(`/users/${id}`);
    setUsers(us => us.map(u => u.id === id ? { ...u, is_active: false } : u));
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>User Management <span style={{ fontSize: 14, color: '#666', fontWeight: 400 }}>({total} users)</span></h1>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>ID</th>
            <th style={s.th}>Full Name</th>
            <th style={s.th}>Email</th>
            <th style={s.th}>Role</th>
            <th style={s.th}>Status</th>
            <th style={s.th}>Joined</th>
            <th style={s.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td style={s.td}>{u.id}</td>
              <td style={s.td}>{u.full_name}</td>
              <td style={s.td}>{u.email}</td>
              <td style={s.td}>
                <select style={s.select} value={u.role} onChange={(e) => handleRole(u.id, e.target.value)}>
                  <option value="viewer">Viewer</option>
                  <option value="researcher">Researcher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td style={s.td}><span style={s.badge(u.is_active)}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
              <td style={s.td}>{u.created_at?.slice(0,10)}</td>
              <td style={s.td}>
                {u.is_active && (
                  <button style={s.deactivateBtn} onClick={() => handleDeactivate(u.id)}>Deactivate</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
