import React, { useState, useCallback, useMemo } from 'react';
import './ManagePackages.css';
import { Form, Button, Input, Modal, message } from 'antd';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import SearchForm from '../../../components/SearchForm/SearchForm';
import PackagesTable from '../../../components/PackagesTable/PackagesTable';
import salesColumns from './columns/salesColumns';
import serviceColumns from './columns/serviceColumns';
import salesPackageService from '../../../services/salesPackageService';
import servicePackageService from '../../../services/servicePackageService';

const ManagePackages = () => {
    const [salesPackages, setSalesPackages] = useState([]);
    const [servicePackages, setServicePackages] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);
    const [packageType, setPackageType] = useState('');
    const dispatch = useDispatch();

    const [salesForm] = Form.useForm();
    const [serviceForm] = Form.useForm();
    const [form] = Form.useForm();

    const memoizedSalesColumns = useMemo(() => salesColumns, []);
    const memoizedServiceColumns = useMemo(() => serviceColumns, []);

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

    const handleAddPackage = (type) => {
        setCurrentPackage(null);
        setPackageType(type);
        setIsModalVisible(true);
    };

    const handleEditPackage = (pkg, type) => {
        setCurrentPackage(pkg);
        setPackageType(type);
        setIsModalVisible(true);
        form.setFieldsValue(pkg);
    };

    const handleDeletePackage = async (pkg, type) => {
        let response;
        dispatch(ShowLoading());
        try {
            if (type === 'sales') {
                response = await salesPackageService.removePackage(pkg._id);
                handleSalesInputChange();
            } else {
                response = await servicePackageService.removePackage(pkg._id);
                handleServiceInputChange();
            }
            message.success(response);
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    const handleSavePackage = async () => {
        let response;
        const values = await form.validateFields();
        const payload = {
            ...values,
            unitPriceEGP: Number(values.unitPriceEGP),
            quantity: Number(values.quantity),
            totalPriceEGP: Number(values.unitPriceEGP) * Number(values.quantity),
        };
        console.log('Payload: ', payload);
        try {
            if (currentPackage) {
                if (packageType === 'sales') {
                    response = await salesPackageService.updatePackage(currentPackage._id, payload);
                    handleSalesInputChange();
                } else {
                    response = await servicePackageService.updatePackage(currentPackage._id, payload);
                    handleServiceInputChange();
                }
            } else {
                if (packageType === 'sales') {
                    response = await salesPackageService.addPackage(payload);
                    handleSalesInputChange();
                } else {
                    response = await servicePackageService.addPackage(payload);
                    handleServiceInputChange();
                }
            }
            setIsModalVisible(false);
            form.resetFields();
            message.success(response);
        } catch (error) {
            message.error(error.response.data);
        }
    };

    return (
        <div className="manage-packages">
            <div className='btns-container'>
                <Button type="primary" onClick={() => handleAddPackage('sales')}>
                    Add Sales Package
                </Button>
                <Button type="primary" onClick={() => handleAddPackage('service')}>
                    Add Service Package
                </Button>
            </div>
            <h2>Search Sales Packages</h2>
            <SearchForm
                form={salesForm}
                onChange={handleSalesInputChange}
                fields={[
                    { name: 'carCode', placeholder: 'Car Code' },
                    { name: 'rowLineNum', placeholder: 'Row Line Num' },
                ]}
            />
            <PackagesTable
                columns={memoizedSalesColumns}
                dataSource={salesPackages}
                onEditPackage={handleEditPackage}
                onDeletePackage={handleDeletePackage}
                type="sales"
            />

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
            <PackagesTable
                columns={memoizedServiceColumns}
                dataSource={servicePackages}
                onEditPackage={handleEditPackage}
                onDeletePackage={handleDeletePackage}
                type="service"
            />

            <Modal
                title={currentPackage ? 'Edit Package' : 'Add Package'}
                open={isModalVisible}
                onOk={handleSavePackage}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
            >
                <Form form={form} layout="vertical">
                    {packageType === 'sales' ? (
                        <>
                            <Form.Item name="carCode" label="Car Code" rules={[{ required: true, message: 'Please enter car code' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="partNum" label="Part Num" rules={[{ required: true, message: 'Please enter part number' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="rowLineNum" label="Row Line Num" rules={[{ required: true, message: 'Please enter row line number' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="sapNum" label="SAP Num" rules={[{ required: true, message: 'Please enter sap number' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="unitOfMeasurement" label="Unit Of Measurement" rules={[{ required: true, message: 'Please enter unit of measurement' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="unitPriceEGP" label="Unit Price (EGP)" rules={[{ required: true, message: 'Please enter unit price' }]}>
                                <Input type="number" />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item name="carCode" label="Car Code" rules={[{ required: true, message: 'Please enter car code' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="tableNum" label="Table Num" rules={[{ required: true, message: 'Please enter table number' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="itemNum" label="Item Num" rules={[{ required: true, message: 'Please enter item number' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please enter description' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="unitOfMeasurement" label="Unit Of Measurement" rules={[{ required: true, message: 'Please enter unit of measurement' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                                <Input type="number" />
                            </Form.Item>
                            <Form.Item name="unitPriceEGP" label="Unit Price (EGP)" rules={[{ required: true, message: 'Please enter unit price' }]}>
                                <Input type="number" />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default ManagePackages;
