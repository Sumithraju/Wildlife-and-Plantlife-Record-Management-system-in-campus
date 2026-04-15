import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const s = {
  page: { padding: 24, maxWidth: 700, margin: '0 auto' },
  title: { fontSize: 22, fontWeight: 700, color: '#1a5c2a', marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  full: { gridColumn: '1 / -1' },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  select: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14 },
  textarea: { width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: 8, fontSize: 14, minHeight: 100, resize: 'vertical' },
  actions: { display: 'flex', gap: 12, marginTop: 24 },
  btn: { padding: '12px 28px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  err: { background: '#f8d7da', color: '#58151c', border: '1px solid #dc3545', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  success: { background: '#d1e7dd', color: '#0a3622', border: '1px solid #198754', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
};

const EMPTY = { species_name:'', family:'', common_name:'', flowering_season:'', height_cm:'', iucn_status:'', observation_date:'', latitude:'', longitude:'', notes:'' };

export default function PlantForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/plants/${id}`).then(({ data }) => {
        setForm({
          species_name: data.species_name || '',
          family: data.family || '',
          common_name: data.common_name || '',
          flowering_season: data.flowering_season || '',
          height_cm: data.height_cm || '',
          iucn_status: data.iucn_status || '',
          observation_date: data.observation_date?.slice(0,10) || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          notes: data.notes || '',
        });
      });
    }
  }, [id]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.height_cm && parseInt(form.height_cm) < 0) {
      setError('Height must be a positive number'); return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => v !== '' && fd.append(k, v));
      files.forEach(f => fd.append('images', f));

      if (isEdit) {
        await api.put(`/plants/${id}`, form);
      } else {
        await api.post('/plants', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setSuccess('Record saved!');
      setTimeout(() => navigate('/plants'), 1200);
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.map(e => e.msg).join(', ') : err.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>{isEdit ? 'Edit' : 'Add'} Plant Record</h1>
      {error && <div style={s.err}>{error}</div>}
      {success && <div style={s.success}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div style={s.grid}>
          <div>
            <label style={s.label}>Species Name (Scientific) *</label>
            <input style={s.input} value={form.species_name} onChange={set('species_name')} required placeholder="Latin binomial name" />
          </div>
          <div>
            <label style={s.label}>Family</label>
            <input style={s.input} value={form.family} onChange={set('family')} placeholder="e.g. Rosaceae" />
          </div>
          <div>
            <label style={s.label}>Common Name</label>
            <input style={s.input} value={form.common_name} onChange={set('common_name')} />
          </div>
          <div>
            <label style={s.label}>Flowering Season</label>
            <input style={s.input} value={form.flowering_season} onChange={set('flowering_season')} placeholder="e.g. Spring, Mar-May" />
          </div>
          <div>
            <label style={s.label}>Height (cm)</label>
            <input style={s.input} type="number" min="1" value={form.height_cm} onChange={set('height_cm')} placeholder="Approximate height" />
          </div>
          <div>
            <label style={s.label}>IUCN Status</label>
            <select style={s.select} value={form.iucn_status} onChange={set('iucn_status')}>
              <option value="">Unknown</option>
              {['LC','NT','VU','EN','CR','EW','EX'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Observation Date *</label>
            <input style={s.input} type="date" value={form.observation_date} onChange={set('observation_date')} required />
          </div>
          <div></div>
          <div>
            <label style={s.label}>Latitude</label>
            <input style={s.input} type="number" step="0.000001" value={form.latitude} onChange={set('latitude')} />
          </div>
          <div>
            <label style={s.label}>Longitude</label>
            <input style={s.input} type="number" step="0.000001" value={form.longitude} onChange={set('longitude')} />
          </div>
          <div style={s.full}>
            <label style={s.label}>Field Notes</label>
            <textarea style={s.textarea} value={form.notes} onChange={set('notes')} />
          </div>
          {!isEdit && (
            <div style={s.full}>
              <label style={s.label}>Photos (up to 3, max 5 MB each)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} />
            </div>
          )}
        </div>
        <div style={s.actions}>
          <button type="submit" style={{ ...s.btn, background: '#1a5c2a', color: '#fff' }} disabled={loading}>
            {loading ? 'Saving…' : (isEdit ? 'Update Record' : 'Create Record')}
          </button>
          <button type="button" style={{ ...s.btn, background: '#eee', color: '#333' }} onClick={() => navigate('/plants')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
