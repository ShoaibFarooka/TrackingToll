import React from 'react';
import Cookies from 'js-cookie';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/react.svg';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../redux/loaderSlice';
import { setLoggedOut } from '../../redux/logoutSlice';
import userService from '../../services/userService';

const Navbar = React.memo(({ userName, userTeam }) => {
    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(ShowLoading());
        try {
            const response = await userService.logoutUser({});
            Cookies.remove('tracking-toll-jwt-token');
            dispatch(setLoggedOut());
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    return (
        <div className="Navbar">
            <div className="NavRow navabar-light shadow">
                <div className="NavLinks">
                    <div className='flex-link'>
                        <NavLink
                            className="navbar-brand fw-bolder mx-auto"
                            to="/"
                        >
                            <img src={logo} className='logo' alt="Tracking logo" />
                        </NavLink>
                        <NavLink
                            className="navbar-brand mx-auto title"
                            to="/"
                        >
                            {'ACTIV-Q'}
                        </NavLink>
                    </div>
                </div>
                <div className='flex-link'>
                    <div className='username'>{userName ? userName + `(${userTeam})` : ''}</div>
                    <div className="btn-div">
                        <button className="logout-btn btn btn-outline-primary ms-auto rounded-pill" onClick={handleLogout}>
                            <i className="fa fa-sign-in me-2"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Navbar;
