import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
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

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

function RouteFallback() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 font-mono text-xs text-term-dim" role="status" aria-live="polite">
      <span className="text-term-green">$</span> loading module<span className="animate-blink">_</span>
    </div>
  );
}

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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const routes = (
    <Suspense fallback={<RouteFallback />}>
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
    </Suspense>
  );

  return (
    <>
      {!isAdminRoute ? (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[1100] focus:rounded-sm focus:border focus:border-term-green focus:bg-term-surface focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-term-green"
        >
          Skip to main content
        </a>
      ) : null}
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
