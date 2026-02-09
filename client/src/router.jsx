import { Navigate, createBrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import BlogList from './pages/BlogList.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import Donate from './pages/Donate.jsx';
import Contact from './pages/Contact.jsx';
import PolicyPage from './pages/PolicyPage.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminPosts from './pages/admin/AdminPosts.jsx';
import AdminProjects from './pages/admin/AdminProjects.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'blog', element: <BlogList /> },
      { path: 'blog/:slug', element: <BlogDetail /> },
      { path: 'donate', element: <Donate /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy-policy', element: <PolicyPage policyKey="privacy" /> },
      { path: 'terms-and-conditions', element: <PolicyPage policyKey="terms" /> },
      { path: 'refund-policy', element: <PolicyPage policyKey="refund" /> },
      { path: 'admin/login', element: <AdminLogin /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/posts',
        element: (
          <ProtectedRoute>
            <AdminPosts />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/projects',
        element: (
          <ProtectedRoute>
            <AdminProjects />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/settings',
        element: (
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        ),
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
