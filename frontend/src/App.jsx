import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage     from './pages/LoginPage';
import RegisterPage  from './pages/RegisterPage';
import Dashboard     from './pages/Dashboard';
import WildlifeList  from './pages/WildlifeList';
import WildlifeForm  from './pages/WildlifeForm';
import WildlifeDetail from './pages/WildlifeDetail';
import PlantList     from './pages/PlantList';
import PlantForm     from './pages/PlantForm';
import PlantDetail   from './pages/PlantDetail';
import MapView       from './pages/MapView';
import AdminUsers    from './pages/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/wildlife"  element={<ProtectedRoute><WildlifeList /></ProtectedRoute>} />
          <Route path="/wildlife/new" element={<ProtectedRoute roles={['researcher','admin']}><WildlifeForm /></ProtectedRoute>} />
          <Route path="/wildlife/:id" element={<ProtectedRoute><WildlifeDetail /></ProtectedRoute>} />
          <Route path="/wildlife/:id/edit" element={<ProtectedRoute roles={['researcher','admin']}><WildlifeForm /></ProtectedRoute>} />

          <Route path="/plants"    element={<ProtectedRoute><PlantList /></ProtectedRoute>} />
          <Route path="/plants/new" element={<ProtectedRoute roles={['researcher','admin']}><PlantForm /></ProtectedRoute>} />
          <Route path="/plants/:id" element={<ProtectedRoute><PlantDetail /></ProtectedRoute>} />
          <Route path="/plants/:id/edit" element={<ProtectedRoute roles={['researcher','admin']}><PlantForm /></ProtectedRoute>} />

          <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />

          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
