import React, { useState, useEffect } from 'react';
import './ProtectedRoute.css';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserInfo, verifyAuthorization } from '../../utils/authUtils';
import { useDispatch, useSelector } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import Sidebar from '../Sidebar/Sidebar.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import Unauthorized from '../../pages/common/Unauthorized/Unauthorized.jsx';

const ProtectedRoute = ({ children, showNavbar, ...rest }) => {
    const location = useLocation();
    const isAuth = isAuthenticated();
    const [isAuthorized, setIsAuthorized] = useState('pending');
    const hasLoggedOut = useSelector(state => state.logout.hasLoggedOut);
    const [userTeam, setUserTeam] = useState(null);
    const [userName, setUserName] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUserInfo = async () => {
            dispatch(ShowLoading());
            const user = await getUserInfo();
            if (user) {
                setUserTeam(user.team);
                setUserName(user.name);
                const authorized = verifyAuthorization(user.team);
                setIsAuthorized(authorized ? 'yes' : 'no');
            }
            dispatch(HideLoading());
        };

        if (isAuth && (isAuthorized === 'pending' || isAuthorized === 'no')) {
            fetchUserInfo();
        }
    }, [isAuth, location]);

    return isAuth ? (
        <div className='page'>
            <Sidebar userTeam={userTeam} />
            {showNavbar && <Navbar userName={userName} userTeam={userTeam} />}
            {isAuthorized === 'pending' ?
                <div className='content'></div>
                :
                isAuthorized === 'yes' ?
                    <div className='content'>
                        {React.cloneElement(children, { userTeam, ...rest })}
                    </div>
                    :
                    <div className='content'>
                        <Unauthorized />
                    </div>
            }
            {showNavbar && <Footer />}
        </div>
    ) : (
        <>
            {
                hasLoggedOut ?
                    <Navigate to="/login" />
                    :
                    <Navigate to="/login" replace state={{ from: location }} />
            }
        </>
    );
};

export default ProtectedRoute;
