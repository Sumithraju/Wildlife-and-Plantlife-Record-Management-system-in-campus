import { useState, useRef, useEffect } from 'react';

const s = {
  wrap: { position: 'relative', display: 'inline-block' },
  btn: {
    background: '#fff', color: '#1a5c2a', border: '1.5px solid #1a5c2a',
    borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 600,
    fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
  },
  dropdown: {
    position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: '#fff',
    border: '1px solid #ddd', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    zIndex: 999, minWidth: 180, overflow: 'hidden',
  },
  item: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', cursor: 'pointer', fontSize: 13,
    borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s',
  },
};

const OPTIONS = [
  { key: 'csv',   icon: '📄', label: 'Export as CSV'   },
  { key: 'excel', icon: '📊', label: 'Export as Excel (.xlsx)' },
  { key: 'pdf',   icon: '📑', label: 'Export as PDF'   },
  { key: 'image', icon: '🖼️', label: 'Export as Image (.png)' },
];

export default function ExportMenu({ onExport, hideImage = false, pdfAndImageOnly = false }) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  let options = OPTIONS;
  if (hideImage) options = options.filter(o => o.key !== 'image');
  if (pdfAndImageOnly) options = options.filter(o => o.key === 'pdf' || o.key === 'image');

  return (
    <div style={s.wrap} ref={ref}>
      <button style={s.btn} onClick={() => setOpen(v => !v)}>
        ⬇ Export {open ? '▲' : '▼'}
      </button>
      {open && (
        <div style={s.dropdown}>
          {options.map(opt => (
            <div
              key={opt.key}
              style={{ ...s.item, background: hover === opt.key ? '#f0f8f1' : '#fff' }}
              onMouseEnter={() => setHover(opt.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => { setOpen(false); onExport(opt.key); }}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
