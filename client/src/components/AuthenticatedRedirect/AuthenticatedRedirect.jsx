import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/authUtils';

const AuthenticatedRedirect = ({ children, ...rest }) => {
    const location = useLocation();
    const isAuth = isAuthenticated();

    if (isAuth) {
        console.log('isAuth: ', isAuth);
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return React.cloneElement(children, { ...rest });
};

export default AuthenticatedRedirect;
