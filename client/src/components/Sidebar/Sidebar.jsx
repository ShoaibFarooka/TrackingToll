import React from 'react';
import './Sidebar.css';
import logo from '../../assets/images/react.svg';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import { menuItems } from '../../constants/menuItems.jsx';

const Sidebar = React.memo(({ userTeam }) => {
    const location = useLocation();
    const items = menuItems[userTeam] || [];

    return (
        <div className="sidebar">
            {/* <Link
                className="navbar-brand fw-bolder mx-auto logo-container"
                to="/"
            >
                <img src={logo} className='logo' alt="Tracking logo" />
            </Link> */}

            <div className='items'>
                {items.map((item) => (
                    <div key={item.path} className={`item ${location.pathname === item.path ? 'active' : ''}`}>
                        <Tooltip placement='right' title={item.label}>
                            <Link to={item.path} className='item-link'>
                                {React.cloneElement(item.icon, { color: location.pathname === item.path ? 'white' : '#373a36', size: '32' })}
                            </Link>
                        </Tooltip>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Sidebar;
