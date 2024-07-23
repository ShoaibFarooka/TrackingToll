import Login from '../pages/common/Login/Login.jsx';
import AuthenticatedRedirect from '../components/AuthenticatedRedirect/AuthenticatedRedirect.jsx';
import Home from '../pages/common/Home/Home.jsx'
import ManageUsers from '../pages/admin/ManageUsers/ManageUsers.jsx';
import ManagePackages from '../pages/sales/ManagePackages/ManagePackages.jsx';
import CreateOrder from '../pages/sales/CreateOrder/CreateOrder.jsx';
import ManageOrders from '../pages/common/ManageOrders/ManageOrders.jsx';
import ViewOrder from '../pages/common/ViewOrder/ViewOrder.jsx';
import NotFound from '../pages/common/NotFound/NotFound.jsx';

const routes = [
  //common
  { path: "/login", element: <AuthenticatedRedirect><Login /></AuthenticatedRedirect>, protected: false, showNavbar: false },
  { path: "/", element: <Home />, protected: true, showNavbar: true },
  { path: "/manage-orders", element: <ManageOrders />, protected: true, showNavbar: true },
  { path: "/view-order/:orderId", element: <ViewOrder />, protected: true, showNavbar: true },

  //admin
  { path: "/admin/manage-users", element: <ManageUsers />, protected: true, showNavbar: true },

  //sales
  { path: "/sales/manage-packages", element: <ManagePackages />, protected: true, showNavbar: true },
  { path: "/sales/create-order", element: <CreateOrder />, protected: true, showNavbar: true },

  //not found
  { path: "*", element: <NotFound />, protected: false, showNavbar: false },
];

export default routes;
