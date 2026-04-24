import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import ExportMenu from '../components/ExportMenu';
import { exportPDF, exportImage } from '../utils/exportUtils';

const s = {
  page: { padding: 24 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a5c2a', marginBottom: 20 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderLeft: '4px solid #1a5c2a' },
  statNum: { fontSize: 32, fontWeight: 700, color: '#1a5c2a' },
  statLabel: { fontSize: 13, color: '#666', marginTop: 4 },
  charts: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },
  chartCard: { background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  chartTitle: { fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 16 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
  th: { background: '#1a5c2a', color: '#fff', padding: '10px 14px', textAlign: 'left', fontSize: 13 },
  td: { padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: 13 },
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ wByCategory: [], wTrend: [], pTrend: [], pending: [], totalW: 0, totalP: 0 });
  const dashRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const [wStats, pStats, wPending, pPending, wTotal, pTotal] = await Promise.all([
          api.get('/wildlife/stats').then(r => r.data),
          api.get('/plants/stats').then(r => r.data),
          api.get('/wildlife?status=pending&limit=5').then(r => r.data),
          api.get('/plants?status=pending&limit=5').then(r => r.data),
          api.get('/wildlife?limit=1').then(r => r.data.total),
          api.get('/plants?limit=1').then(r => r.data.total),
        ]);
        setStats({
          wByCategory: wStats.byCategory || [],
          wTrend: wStats.trend || [],
          pTrend: pStats.trend || [],
          pending: [...(wPending.records || []).map(r => ({ ...r, type: 'wildlife' })),
                   ...(pPending.records || []).map(r => ({ ...r, type: 'plant' }))],
          totalW: wTotal,
          totalP: pTotal,
        });
      } catch { /* silent */ }
    };
    load();
  }, []);

  const handleExport = (type) => {
    const title = 'Campus Biodiversity Portal — Summary Report';
    if (type === 'pdf') {
      const cols = ['Metric', 'Value'];
      const body = [
        ['Total Wildlife Records', stats.totalW],
        ['Total Plant Records', stats.totalP],
        ['Pending Approvals', stats.pending.length],
        ['Wildlife Categories', stats.wByCategory.length],
        ...stats.wByCategory.map(r => [`Wildlife — ${r.category}`, r.count]),
      ];
      return exportPDF(cols, body, title, 'dashboard_report');
    }
    if (type === 'image') return exportImage(dashRef.current, 'dashboard_report');
  };

  const combinedTrend = stats.wTrend.map(w => ({
    month: w.month,
    Wildlife: parseInt(w.count),
    Plants: parseInt(stats.pTrend.find(p => p.month === w.month)?.count || 0),
  }));

  return (
    <div style={s.page}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <h1 style={s.title}>Dashboard — Campus Biodiversity Portal</h1>
        <ExportMenu onExport={handleExport} hideImage={false} pdfAndImageOnly />
      </div>
      <p style={{ color: '#666', marginBottom: 20 }}>Welcome, <strong>{user?.full_name}</strong> · Role: {user?.role}</p>

      {/* Stat Cards */}
      <div ref={dashRef}>
      <div style={s.grid}>
        <div style={s.statCard}>
          <div style={s.statNum}>{stats.totalW}</div>
          <div style={s.statLabel}>Wildlife Records</div>
        </div>
        <div style={s.statCard}>
          <div style={s.statNum}>{stats.totalP}</div>
          <div style={s.statLabel}>Plant Records</div>
        </div>
        <div style={{ ...s.statCard, borderLeftColor: '#ffc107' }}>
          <div style={{ ...s.statNum, color: '#856404' }}>{stats.pending.length}</div>
          <div style={s.statLabel}>Pending Approvals</div>
        </div>
        <div style={{ ...s.statCard, borderLeftColor: '#0d6efd' }}>
          <div style={{ ...s.statNum, color: '#0d6efd' }}>{stats.wByCategory.length}</div>
          <div style={s.statLabel}>Wildlife Categories</div>
        </div>
      </div>

      {/* Charts */}
      <div style={s.charts}>
        <div style={s.chartCard}>
          <div style={s.chartTitle}>Wildlife by Category</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.wByCategory.map(r => ({ name: r.category, Count: parseInt(r.count) }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Count" fill="#1a5c2a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.chartCard}>
          <div style={s.chartTitle}>Monthly Sightings (Last 12 Months)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={combinedTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Wildlife" stroke="#1a5c2a" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Plants" stroke="#1565c0" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      </div>{/* end dashRef */}

      {/* Pending Approvals Queue */}
      {isAdmin && stats.pending.length > 0 && (
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#333', marginBottom: 12 }}>Pending Approvals Queue</h2>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Type</th>
                <th style={s.th}>Species</th>
                <th style={s.th}>Observer</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.pending.map(r => (
                <tr key={`${r.type}-${r.id}`}>
                  <td style={s.td}>{r.type === 'wildlife' ? '🦅' : '🌿'} {r.type}</td>
                  <td style={{ ...s.td, fontStyle: 'italic' }}>{r.species_name}</td>
                  <td style={s.td}>{r.observer_name}</td>
                  <td style={s.td}>{r.observation_date?.slice(0,10)}</td>
                  <td style={s.td}><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
