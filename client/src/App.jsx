import { Outlet, useLocation } from 'react-router-dom';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-shell">
      {!isAdminRoute && <Header />}
      <main className={isAdminRoute ? 'app-main app-main--admin' : 'app-main app-main--public'}>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
