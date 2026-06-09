import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { PublicDataProvider } from './context/PublicDataContext';
import { TerminalProvider, useTerminal } from './context/TerminalContext';
import MatrixRain from './components/MatrixRain';
import ProtectedRoute from './components/ProtectedRoute';
import PublicDataGate from './components/PublicDataGate';
import TerminalNav from './components/TerminalNav';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminAbout from './pages/admin/AdminAbout';
import AdminSkills from './pages/admin/AdminSkills';
import AdminMessages from './pages/admin/AdminMessages';

const publicRoutePaths = {
  '/': '~/portfolio/home',
  '/projects': '~/portfolio/projects',
  '/about': '~/portfolio/about',
  '/skills': '~/portfolio/skills',
  '/contact': '~/portfolio/contact',
  '/login': '~/portfolio/login'
};

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const terminalPath = publicRoutePaths[location.pathname] || '~/portfolio';
  const { matrixEnabled, crtEnabled } = useTerminal();

  useEffect(() => {
    if (crtEnabled) {
      document.body.classList.add('crt-enabled');
    } else {
      document.body.classList.remove('crt-enabled');
    }
  }, [crtEnabled]);

  useEffect(() => {
    if (matrixEnabled && !isAdminRoute) {
      document.body.classList.add('matrix-enabled');
    } else {
      document.body.classList.remove('matrix-enabled');
    }
  }, [matrixEnabled, isAdminRoute]);

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/about"
        element={
          <ProtectedRoute>
            <AdminAbout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/skills"
        element={
          <ProtectedRoute>
            <AdminSkills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/messages"
        element={
          <ProtectedRoute>
            <AdminMessages />
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  return (
    <>
      {matrixEnabled && !isAdminRoute ? <MatrixRain /> : null}
      {!isAdminRoute ? <TerminalNav /> : null}
      {isAdminRoute ? routes : <PublicDataGate path={terminalPath}>{routes}</PublicDataGate>}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PublicDataProvider>
          <TerminalProvider>
            <AppLayout />
          </TerminalProvider>
        </PublicDataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
