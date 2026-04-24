import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import ExportMenu from '../components/ExportMenu';
import { exportCSV, exportExcel, exportPDF, exportImage } from '../utils/exportUtils';

const s = {
  page: { padding: 24 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a5c2a' },
  addBtn: { background: '#1a5c2a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 },
  filters: { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' },
  input: { padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, minWidth: 200 },
  select: { padding: '8px 12px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#1a5c2a', color: '#fff', padding: '12px 16px', textAlign: 'left', fontSize: 13, fontWeight: 600 },
  td: { padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 14, color: '#333' },
  actionBtn: { padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, marginRight: 6 },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 20 },
  pageBtn: { padding: '8px 16px', border: '1.5px solid #1a5c2a', borderRadius: 8, background: '#fff', color: '#1a5c2a', cursor: 'pointer', fontWeight: 600 },
};

export default function WildlifeList() {
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const { isResearcher, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const tableRef = useRef();
  const limit = 10;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (status) params.set('status', status);
      const { data } = await api.get(`/wildlife?${params}`);
      setRecords(data.records);
      setTotal(data.total);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, search, category, status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    await api.delete(`/wildlife/${id}`);
    load();
  };

  const totalPages = Math.ceil(total / limit);

  const getAllRecords = async () => {
    const params = new URLSearchParams({ limit: 1000 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (status) params.set('status', status);
    const { data } = await api.get(`/wildlife?${params}`);
    return (data.records || []).map(r => ({
      'Species Name': r.species_name,
      'Common Name': r.common_name || '',
      'Category': r.category,
      'Observation Date': r.observation_date?.slice(0, 10),
      'Latitude': r.latitude,
      'Longitude': r.longitude,
      'Habitat': r.habitat || '',
      'Notes': r.notes || '',
      'Status': r.status,
      'Observer': r.observer_name || '',
    }));
  };

  const handleExport = async (type) => {
    const rows = await getAllRecords();
    const filename = 'wildlife_records';
    const title = 'Wildlife Records — Campus Biodiversity Portal';
    if (type === 'csv')   return exportCSV(rows, filename);
    if (type === 'excel') return exportExcel(rows, filename, 'Wildlife');
    if (type === 'pdf') {
      const cols = ['Species Name', 'Common Name', 'Category', 'Date', 'Habitat', 'Status', 'Observer'];
      const body = rows.map(r => [r['Species Name'], r['Common Name'], r['Category'], r['Observation Date'], r['Habitat'], r['Status'], r['Observer']]);
      return exportPDF(cols, body, title, filename);
    }
    if (type === 'image') return exportImage(tableRef.current, filename);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Wildlife Records <span style={{ fontSize: 14, color: '#666', fontWeight: 400 }}>({total} total)</span></h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <ExportMenu onExport={handleExport} />
          {isResearcher && <button style={s.addBtn} onClick={() => navigate('/wildlife/new')}>+ Add Record</button>}
        </div>
      </div>

      <div style={s.filters}>
        <input style={s.input} placeholder="Search species…" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <select style={s.select} value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {['mammal','bird','reptile','amphibian','insect','fish'].map(c =>
            <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
          )}
        </select>
        <select style={s.select} value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? <p>Loading…</p> : (
        <table ref={tableRef} style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>Species Name</th>
              <th style={s.th}>Common Name</th>
              <th style={s.th}>Category</th>
              <th style={s.th}>Date</th>
              <th style={s.th}>Status</th>
              <th style={s.th}>Observer</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', color: '#999' }}>No records found</td></tr>
            ) : records.map(r => (
              <tr key={r.id}>
                <td style={{ ...s.td, fontStyle: 'italic' }}>{r.species_name}</td>
                <td style={s.td}>{r.common_name || '—'}</td>
                <td style={s.td}>{r.category}</td>
                <td style={s.td}>{r.observation_date?.slice(0,10)}</td>
                <td style={s.td}><StatusBadge status={r.status} /></td>
                <td style={s.td}>{r.observer_name}</td>
                <td style={s.td}>
                  <button style={{ ...s.actionBtn, background: '#e7f3eb', color: '#1a5c2a' }}
                    onClick={() => navigate(`/wildlife/${r.id}`)}>View</button>
                  {(isAdmin || user?.id === r.user_id) && (
                    <>
                      <button style={{ ...s.actionBtn, background: '#fff3cd', color: '#856404' }}
                        onClick={() => navigate(`/wildlife/${r.id}/edit`)}>Edit</button>
                      <button style={{ ...s.actionBtn, background: '#f8d7da', color: '#58151c' }}
                        onClick={() => handleDelete(r.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div style={s.pagination}>
          <button style={s.pageBtn} onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
          <span style={{ fontSize: 14, color: '#666' }}>Page {page} of {totalPages}</span>
          <button style={s.pageBtn} onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  );
}
