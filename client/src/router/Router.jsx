import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';
import routes from './RouteConfig.jsx';

const Router = () => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={route.protected ? <ProtectedRoute showNavbar={route.showNavbar}>{route.element}</ProtectedRoute> : route.element}
        />
      ))}
    </Routes>
  );
};

export default Router;
