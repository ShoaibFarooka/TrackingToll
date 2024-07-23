import Cookies from 'js-cookie';
import userService from '../services/userService';
import { message } from 'antd';
import { menuItems } from '../constants/menuItems';

const isAuthenticated = () => {
    const token = Cookies.get('tracking-toll-jwt-token');
    return !!token;
};

const getUserInfo = async () => {
    try {
        const response = await userService.getUserInfo();
        console.log('User role fetched!')
        if (response.user) {
            return response.user;
        }
        return null;
    } catch (error) {
        const errorContent = error.response.data || error.message || error.toString();
        message.error(errorContent);
        return null;
    }
};

const verifyAuthorization = (team) => {
    if (team === 'admin') {
        return true;
    }

    const allowedPages = menuItems[team]?.map(item => item.path) || [];
    const currentPath = window.location.pathname;

    const viewOrderRegex = /^\/view-order\/[a-fA-F0-9]{24}$/; // assuming MongoDB ObjectId for orderId

    if (viewOrderRegex.test(currentPath)) {
        return true;
    }

    return allowedPages.includes(currentPath);
};

export { isAuthenticated, getUserInfo, verifyAuthorization };