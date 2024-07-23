import React, { useEffect, useState } from 'react';
import './ManageOrders.css';
import { useNavigate } from 'react-router-dom';
import { message, Table } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import createOrderColumns from './columns/orderColumns';
import orderService from '../../../services/orderService';

const ManageOrders = () => {
    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllOrders = async () => {
            dispatch(ShowLoading());
            try {
                const response = await orderService.getAllOrders();
                if (response.orders) {
                    setOrders(response.orders);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                message.error(error.response.data);
            }
            dispatch(HideLoading());
        };

        fetchAllOrders();
    }, []);

    const handleViewOrder = (order) => {
        navigate(`/view-order/${order._id}`);
    };

    const handleGeneratePDF = async (order) => {
        dispatch(ShowLoading());
        try {
            const response = await orderService.downloadOrderPDF(order._id);
            if (response?.data) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                let a = document.createElement('a');
                a.style.display = 'none';
                document.body.appendChild(a);
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = `order_${order._id}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            if (!error?.response) {
                message.error('Blocked by clinet!');
            }
            else {
                message.error(error?.response?.data);
            }
        }
        finally {
            dispatch(HideLoading());
        }
    };

    const memoizedOrderColumns = React.useMemo(() => createOrderColumns(handleViewOrder, handleGeneratePDF), [handleViewOrder, handleGeneratePDF]);

    return (
        <div className='manage-orders'>
            <h2>Manage Orders</h2>
            <Table
                dataSource={orders}
                columns={memoizedOrderColumns}
                rowKey="_id"
                pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                scroll={orders.length > 10 ? { y: 400 } : undefined}
            />
        </div>
    );
};

export default ManageOrders;
