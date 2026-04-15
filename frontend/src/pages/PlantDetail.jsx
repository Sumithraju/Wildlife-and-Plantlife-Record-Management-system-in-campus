import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

const iucnColor = { LC:'#d1e7dd', NT:'#cfe2ff', VU:'#fff3cd', EN:'#f8d7da', CR:'#f8d7da', EW:'#e2e3e5', EX:'#e2e3e5' };

const s = {
  page: { padding: 24, maxWidth: 700, margin: '0 auto' },
  card: { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  title: { fontSize: 22, fontWeight: 700, color: '#1a5c2a', fontStyle: 'italic', marginBottom: 4 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 },
  fieldLabel: { color: '#888', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 },
  fieldValue: { color: '#222', marginTop: 2, fontSize: 14 },
  actions: { display: 'flex', gap: 10, marginTop: 24 },
  btn: { padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13 },
  adminBox: { background: '#f0f9f4', border: '1px solid #c3e6cb', borderRadius: 8, padding: 16, marginTop: 20 },
};

export default function PlantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    api.get(`/plants/${id}`).then(({ data }) => setRecord(data)).catch(() => navigate('/plants'));
  }, [id]);

  const handleStatus = async (status) => {
    await api.patch(`/plants/${id}/status`, { status });
    setRecord(r => ({ ...r, status }));
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this plant record permanently?')) return;
    await api.delete(`/plants/${id}`);
    navigate('/plants');
  };

  if (!record) return <div style={{ padding: 40, textAlign: 'center' }}>Loading…</div>;

  const Field = ({ label, value }) => (
    <div>
      <div style={s.fieldLabel}>{label}</div>
      <div style={s.fieldValue}>{value || '—'}</div>
    </div>
  );

  return (
    <div style={s.page}>
      <button style={{ background: 'none', border: 'none', color: '#1a5c2a', cursor: 'pointer', marginBottom: 16, fontSize: 14 }}
        onClick={() => navigate('/plants')}>← Back to list</button>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={s.title}>{record.species_name}</h1>
            <p style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>{record.common_name} · {record.family}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {record.iucn_status && (
              <span style={{ padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 700, background: iucnColor[record.iucn_status] || '#eee' }}>
                IUCN: {record.iucn_status}
              </span>
            )}
            <StatusBadge status={record.status} />
          </div>
        </div>

        <div style={s.grid}>
          <Field label="Observation Date" value={record.observation_date?.slice(0,10)} />
          <Field label="Observer" value={record.observer_name} />
          <Field label="Flowering Season" value={record.flowering_season} />
          <Field label="Height" value={record.height_cm ? `${record.height_cm} cm` : null} />
          <Field label="Latitude" value={record.latitude} />
          <Field label="Longitude" value={record.longitude} />
        </div>

        {record.notes && (
          <div style={{ marginTop: 16 }}>
            <div style={s.fieldLabel}>Field Notes</div>
            <p style={{ marginTop: 6, color: '#333', lineHeight: 1.6 }}>{record.notes}</p>
          </div>
        )}

        {record.images?.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={s.fieldLabel}>Gallery</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
              {record.images.map((url, i) => (
                <img key={i} src={url} alt={`Photo ${i+1}`}
                  style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }} />
              ))}
            </div>
          </div>
        )}

        {isAdmin && (
          <div style={s.adminBox}>
            <strong style={{ fontSize: 13, color: '#1a5c2a' }}>Admin: Change Status</strong>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button style={{ ...s.btn, background: '#d1e7dd', color: '#0a3622' }} onClick={() => handleStatus('verified')}>Verify</button>
              <button style={{ ...s.btn, background: '#fff3cd', color: '#856404' }} onClick={() => handleStatus('pending')}>Set Pending</button>
              <button style={{ ...s.btn, background: '#f8d7da', color: '#58151c' }} onClick={() => handleStatus('rejected')}>Reject</button>
            </div>
          </div>
        )}

        <div style={s.actions}>
          {(isAdmin || user?.id === record.user_id) && (
            <>
              <button style={{ ...s.btn, background: '#1a5c2a', color: '#fff' }}
                onClick={() => navigate(`/plants/${id}/edit`)}>Edit</button>
              <button style={{ ...s.btn, background: '#f8d7da', color: '#58151c' }}
                onClick={handleDelete}>Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
