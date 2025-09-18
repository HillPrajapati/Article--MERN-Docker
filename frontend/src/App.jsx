import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import Loading from './components/common/Loading.jsx';
import ProtectedRoute from './components/common/ProtectedRoute.jsx';
import './styles.css';



// lazy pages
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Articles = lazy(() => import('./pages/Articles.jsx'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail.jsx'));
const ArticleForm = lazy(() => import('./pages/ArticleForm.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Layout =  lazy(() => import('./Layout.jsx'));
// wrapper to conditionally apply layout
function AppRoutes() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/signup'];

  const isAuthPage = noLayoutRoutes.includes(location.pathname);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* public routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* all other routes with layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/new" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
                <Route path="/articles/:id" element={<ArticleDetail />} />
                <Route path="/articles/:id/edit" element={<ProtectedRoute><ArticleForm /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/" element={<Navigate to="/articles" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
