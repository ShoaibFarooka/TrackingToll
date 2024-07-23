import { FaUsers, FaBoxOpen, FaClipboardList, FaHome } from 'react-icons/fa';
import { AiFillFileAdd } from "react-icons/ai";

export const menuItems = {
    admin: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/admin/manage-users', label: 'Manage Users', icon: <FaUsers /> },
        { path: '/sales/manage-packages', label: 'Manage Packages', icon: <FaBoxOpen /> },
        { path: '/sales/create-order', label: 'Create Order', icon: <AiFillFileAdd /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    sales: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/sales/manage-packages', label: 'Manage Packages', icon: <FaBoxOpen /> },
        { path: '/sales/create-order', label: 'Create Order', icon: <AiFillFileAdd /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    application: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    operations_support: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/sales/manage-packages', label: 'Manage Packages', icon: <FaBoxOpen /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    asset_inventory: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    repair_maintenance: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    logistics: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
    field_operation: [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/manage-orders', label: 'Manage Orders', icon: <FaClipboardList /> },
    ],
};
