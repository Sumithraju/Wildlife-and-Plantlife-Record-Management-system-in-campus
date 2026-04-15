const colors = {
  pending:  { bg: '#fff3cd', color: '#856404', border: '#ffc107' },
  verified: { bg: '#d1e7dd', color: '#0a3622', border: '#198754' },
  rejected: { bg: '#f8d7da', color: '#58151c', border: '#dc3545' },
};

export default function StatusBadge({ status }) {
  const c = colors[status] || colors.pending;
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      textTransform: 'capitalize',
    }}>
      {status}
    </span>
  );
}
