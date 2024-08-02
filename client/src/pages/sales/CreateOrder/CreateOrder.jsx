import React, { useState, useCallback, useMemo } from 'react';
import './CreateOrder.css';
import { debounce } from 'lodash';
import { Form, Button, message, Upload } from 'antd';
import { MdOutlineFileUpload } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import ClientForm from './components/ClientForm/ClinetForm';
import TeamResponseForm from '../../../components/TeamResponseForm/TeamResponseForm';
import SearchForm from '../../../components/SearchForm/SearchForm';
import PackagesTable from '../../../components/PackagesTable/PackagesTable';
import OrderSummary from './components/OrderSummary/OrderSummary';
import salesColumns from './columns/salesColumns';
import serviceColumns from './columns/serviceColumns';
import salesPackageService from '../../../services/salesPackageService';
import servicePackageService from '../../../services/servicePackageService';
import orderService from '../../../services/orderService';

const CreateOrder = () => {
    const [salesPackages, setSalesPackages] = useState([]);
    const [servicePackages, setServicePackages] = useState([]);
    const [salesOrderItems, setSalesOrderItems] = useState([]);
    const [serviceOrderItems, setServiceOrderItems] = useState([]);

    const [clientForm] = Form.useForm();
    const [teamResponseForm] = Form.useForm();
    const [salesForm] = Form.useForm();
    const [serviceForm] = Form.useForm();

    const memoizedSalesColumns = useMemo(() => salesColumns, []);
    const memoizedServiceColumns = useMemo(() => serviceColumns, []);

    const dispatch = useDispatch();

    const debouncedSearchSalesPackages = useCallback(
        debounce(async (values) => {
            console.log('Searching sales packages....');
            try {
                const response = await salesPackageService.searchPackages(values);
                if (response.salesPackages) {
                    setSalesPackages(response.salesPackages);
                }
            } catch (error) {
                console.error(error.response?.data);
                setSalesPackages([]);
            }
        }, 300),
        []
    );

    const debouncedSearchServicePackages = useCallback(
        debounce(async (values) => {
            console.log('Searching service packages....');
            try {
                const response = await servicePackageService.searchPackages(values);
                if (response.servicePackages) {
                    setServicePackages(response.servicePackages);
                }
            } catch (error) {
                console.error(error.response?.data);
                setServicePackages([]);
            }
        }, 300),
        []
    );

    const handleSalesInputChange = useCallback(() => {
        salesForm.validateFields().then(values => {
            const { carCode, rowLineNum } = values;
            if (carCode || rowLineNum) {
                debouncedSearchSalesPackages(values);
            } else {
                setSalesPackages([]);
            }
        });
    }, [debouncedSearchSalesPackages, salesForm]);

    const handleServiceInputChange = useCallback(() => {
        serviceForm.validateFields().then(values => {
            const { carCode, tableNum, itemNum } = values;
            if (carCode || (tableNum && itemNum)) {
                debouncedSearchServicePackages(values);
            } else {
                setServicePackages([]);
            }
        });
    }, [debouncedSearchServicePackages, serviceForm]);

    const handleAddToOrder = useCallback((item, newQuantity, type) => {
        console.log('Item to add...', item);
        const setOrderItems = type === 'service' ? setServiceOrderItems : setSalesOrderItems;

        setOrderItems(prevItems => {
            const exists = prevItems.find(orderItem => orderItem._id === item._id);
            if (exists) {
                return prevItems.map(orderItem =>
                    orderItem._id === item._id
                        ? {
                            ...orderItem,
                            quantity: newQuantity,
                            totalPriceEGP: newQuantity * item.unitPriceEGP
                        }
                        : orderItem
                );
            }
            return [...prevItems, {
                ...item,
                quantity: newQuantity,
                totalPriceEGP: newQuantity * item.unitPriceEGP
            }];
        });
        message.success('Item added to order');
    }, [salesOrderItems, serviceOrderItems]);

    const handleDiscard = useCallback((id, type) => {
        const setOrderItems = type === 'service' ? setServiceOrderItems : setSalesOrderItems;
        setOrderItems(prevItems => prevItems.filter(item => item._id !== id));
        message.success('Item removed from order');
    }, []);

    const handleReset = () => {
        clientForm.resetFields();
        teamResponseForm.resetFields();
        salesForm.resetFields();
        serviceForm.resetFields();
        setSalesOrderItems([]);
        setServiceOrderItems([]);
        setSalesPackages([]);
        setServicePackages([]);
    };

    const handleSubmitOrder = async () => {
        const clientInfo = await clientForm.validateFields();
        const teamResponse = await teamResponseForm.validateFields();
        const formattedSalesOrderItems = salesOrderItems?.map(item => ({
            package: item._id,
            quantity: item.quantity
        }));
        const formattedServiceOrderItems = serviceOrderItems?.map(item => ({
            package: item._id,
            quantity: item.quantity
        }));
        const order = {
            clientInfo,
            salesOrderItems: formattedSalesOrderItems,
            serviceOrderItems: formattedServiceOrderItems,
            teamCode: teamResponse.code,
            teamComments: teamResponse.comments,
            dtNumber: teamResponse.dtNumber,
            wptsNumber: teamResponse.wptsNumber,
            cparNumber: teamResponse.cparNumber,
        };
        console.log('Order submitted:', order);
        dispatch(ShowLoading());
        try {
            const response = await orderService.createOrder(order);
            message.success(response);
            handleReset();
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    return (
        <div className="create-order">
            <h2>Client Information</h2>
            <ClientForm form={clientForm} />

            <h2>Response</h2>
            <TeamResponseForm form={teamResponseForm} />

            <h2>Search Sales Packages</h2>
            <SearchForm
                form={salesForm}
                onChange={handleSalesInputChange}
                fields={[
                    { name: 'carCode', placeholder: 'Car Code' },
                    { name: 'rowLineNum', placeholder: 'Row Line Num' },
                ]}
            />
            <PackagesTable columns={memoizedSalesColumns} dataSource={salesPackages} onAddToOrder={handleAddToOrder} type="sales" />

            <h2>Search Service Packages</h2>
            <SearchForm
                form={serviceForm}
                onChange={handleServiceInputChange}
                fields={[
                    { name: 'carCode', placeholder: 'Car Code' },
                    { name: 'tableNum', placeholder: 'Table Num' },
                    { name: 'itemNum', placeholder: 'Item Num' },
                ]}
            />
            <PackagesTable columns={memoizedServiceColumns} dataSource={servicePackages} onAddToOrder={handleAddToOrder} type="service" />

            <h2>Order Summary</h2>
            <OrderSummary salesOrderItems={salesOrderItems} serviceOrderItems={serviceOrderItems} handleDiscard={handleDiscard} />

            <div className='flex-btns'>
                <Button type="primary" onClick={handleReset}>Reset</Button>
                <Upload action={''}>
                    <Button icon={<MdOutlineFileUpload size={24} />} className='flex'>Click to Upload</Button>
                </Upload>
                <Button type="primary" onClick={handleSubmitOrder}>Submit Order</Button>
            </div>
        </div>
    );
};

export default CreateOrder;
