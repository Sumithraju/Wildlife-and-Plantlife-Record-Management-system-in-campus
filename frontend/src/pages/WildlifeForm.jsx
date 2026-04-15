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

const EMPTY = { species_name:'', common_name:'', category:'bird', observation_date:'', latitude:'', longitude:'', habitat:'', notes:'' };

export default function WildlifeForm() {
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
      api.get(`/wildlife/${id}`).then(({ data }) => {
        setForm({
          species_name: data.species_name || '',
          common_name: data.common_name || '',
          category: data.category || 'bird',
          observation_date: data.observation_date?.slice(0,10) || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
          habitat: data.habitat || '',
          notes: data.notes || '',
        });
      });
    }
  }, [id]);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => v !== '' && fd.append(k, v));
      files.forEach(f => fd.append('images', f));

      if (isEdit) {
        await api.put(`/wildlife/${id}`, form);
      } else {
        await api.post('/wildlife', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setSuccess('Record saved!');
      setTimeout(() => navigate('/wildlife'), 1200);
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs ? errs.map(e => e.msg).join(', ') : err.response?.data?.error || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <h1 style={s.title}>{isEdit ? 'Edit' : 'Add'} Wildlife Record</h1>
      {error && <div style={s.err}>{error}</div>}
      {success && <div style={s.success}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div style={s.grid}>
          <div>
            <label style={s.label}>Species Name *</label>
            <input style={s.input} value={form.species_name} onChange={set('species_name')} required placeholder="Scientific name" />
          </div>
          <div>
            <label style={s.label}>Common Name</label>
            <input style={s.input} value={form.common_name} onChange={set('common_name')} placeholder="Common/local name" />
          </div>
          <div>
            <label style={s.label}>Category *</label>
            <select style={s.select} value={form.category} onChange={set('category')} required>
              {['mammal','bird','reptile','amphibian','insect','fish'].map(c =>
                <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>
              )}
            </select>
          </div>
          <div>
            <label style={s.label}>Observation Date *</label>
            <input style={s.input} type="date" value={form.observation_date} onChange={set('observation_date')} required />
          </div>
          <div>
            <label style={s.label}>Latitude</label>
            <input style={s.input} type="number" step="0.000001" value={form.latitude} onChange={set('latitude')} placeholder="e.g. 1.295123" />
          </div>
          <div>
            <label style={s.label}>Longitude</label>
            <input style={s.input} type="number" step="0.000001" value={form.longitude} onChange={set('longitude')} placeholder="e.g. 103.771456" />
          </div>
          <div style={s.full}>
            <label style={s.label}>Habitat Description</label>
            <input style={s.input} value={form.habitat} onChange={set('habitat')} placeholder="e.g. Campus lawn, Pond margin" />
          </div>
          <div style={s.full}>
            <label style={s.label}>Behavioural Notes</label>
            <textarea style={s.textarea} value={form.notes} onChange={set('notes')} placeholder="Observations, behaviour, count…" />
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
          <button type="button" style={{ ...s.btn, background: '#eee', color: '#333' }} onClick={() => navigate('/wildlife')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
