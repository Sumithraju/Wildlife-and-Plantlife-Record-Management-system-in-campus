import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';

const s = {
  page: { padding: 24, height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' },
  header: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: 700, color: '#1a5c2a' },
  legend: { display: 'flex', gap: 20, marginTop: 8, fontSize: 13 },
  dot: (c) => ({ width: 12, height: 12, borderRadius: '50%', background: c, display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }),
  mapWrap: { flex: 1, borderRadius: 12, overflow: 'hidden', border: '1px solid #ddd' },
  popup: { fontSize: 13, lineHeight: 1.6 },
};

export default function MapView() {
  const [wildlife, setWildlife] = useState([]);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    api.get('/wildlife?status=verified&limit=200').then(({ data }) => setWildlife(data.records || [])).catch(() => {});
    api.get('/plants?status=verified&limit=200').then(({ data }) => setPlants(data.records || [])).catch(() => {});
  }, []);

  const center = [12.844, 77.658];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Interactive Campus Map</h1>
        <div style={s.legend}>
          <span><span style={s.dot('#1a5c2a')} />Wildlife ({wildlife.length})</span>
          <span><span style={s.dot('#1565c0')} />Plants ({plants.length})</span>
          <span style={{ color: '#666' }}>Showing verified sightings only</span>
        </div>
      </div>

      <div style={s.mapWrap}>
        <MapContainer center={center} zoom={16} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {wildlife.filter(r => r.latitude && r.longitude).map(r => (
            <CircleMarker
              key={`w-${r.id}`}
              center={[parseFloat(r.latitude), parseFloat(r.longitude)]}
              radius={8} fillColor="#1a5c2a" color="#fff" weight={2} fillOpacity={0.85}
            >
              <Popup>
                <div style={s.popup}>
                  <strong style={{ fontStyle: 'italic' }}>{r.species_name}</strong><br />
                  {r.common_name && <>{r.common_name}<br /></>}
                  Category: {r.category}<br />
                  Date: {r.observation_date?.slice(0, 10)}<br />
                  Observer: {r.observer_name}
                </div>
              </Popup>
            </CircleMarker>
          ))}
          {plants.filter(r => r.latitude && r.longitude).map(r => (
            <CircleMarker
              key={`p-${r.id}`}
              center={[parseFloat(r.latitude), parseFloat(r.longitude)]}
              radius={8} fillColor="#1565c0" color="#fff" weight={2} fillOpacity={0.85}
            >
              <Popup>
                <div style={s.popup}>
                  <strong style={{ fontStyle: 'italic' }}>{r.species_name}</strong><br />
                  {r.common_name && <>{r.common_name}<br /></>}
                  Family: {r.family || '—'}<br />
                  IUCN: {r.iucn_status || '—'}<br />
                  Date: {r.observation_date?.slice(0, 10)}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
