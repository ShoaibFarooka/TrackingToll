import React, { useEffect, useState, useCallback } from 'react';
import './ViewOrder.css';
import { useParams } from 'react-router-dom';
import { message, Table, Form, Button, Modal, Upload, InputNumber } from 'antd';
import { MdOutlineFileUpload } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import salesColumns from './columns/salesColumns';
import serviceColumns from './columns/serviceColumns';
import TeamResponseForm from '../../../components/TeamResponseForm/TeamResponseForm.jsx';
import EngineersList from './components/EngineersList/EngineersList.jsx';
import orderService from '../../../services/orderService';

const ViewOrder = React.memo(({ userTeam }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isChangeModalVisible, setIsChangeModalVisible] = useState(false);
    const [engineers, setEngineers] = useState([]);

    const [teamResponseForm] = Form.useForm();
    const [changeForm] = Form.useForm();

    const { orderId } = useParams();
    const dispatch = useDispatch();

    const memoizedSalesColumns = React.useMemo(() => salesColumns, []);
    const memoizedServiceColumns = React.useMemo(() => serviceColumns, []);

    const fetchOrderDetails = useCallback(async () => {
        dispatch(ShowLoading());
        try {
            const response = await orderService.getOrderById(orderId);
            if (response.order) {
                setSelectedOrder(response.order);
            }
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    }, [dispatch, orderId]);

    useEffect(() => {
        fetchOrderDetails();
    }, [fetchOrderDetails]);

    const handleReset = () => {
        teamResponseForm.resetFields();
        changeForm.resetFields();
        setIsChangeModalVisible(false);
    };

    const handleUpdateTeamResponse = async (status) => {
        const values = await teamResponseForm.validateFields();
        const confirmation = window.confirm('Are you sure you want to proceed with this action?');
        if (!confirmation) {
            return;
        }
        const payload = {
            teamCode: values.code,
            teamComments: values.comments,
            status,
            dtNumber: values.dtNumber,
            wptsNumber: values.wptsNumber,
            cparNumber: values.cparNumber,
        };
        dispatch(ShowLoading());
        try {
            const response = await orderService.updateTeamResponse(selectedOrder._id, payload);
            message.success(response);
            fetchOrderDetails();
            handleReset();
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    const validateEngineersList = () => {
        console.log('Eng: ', engineers);
        const isValid = engineers.every(row => row.item !== '' && row.name !== '' && row.id !== '' && row.position !== '');
        return isValid;
    }

    const handleCompleteOrder = async (state) => {
        const values2 = await changeForm.validateFields();
        if (!validateEngineersList()) {
            message.error('Please fill in all fields in all engineers rows before submitting.');
            return;
        }
        let finalSalesOrderItems = [];
        let finalServiceOrderItems = [];
        if (state === 'changes') {
            finalSalesOrderItems = selectedOrder.initialSalesOrderItems.map((item, index) => ({
                package: item.package._id,
                quantity: values2[`salesQuantity${index}`] !== undefined ? values2[`salesQuantity${index}`] : item.quantity,
            })).filter(item => item.quantity > 0);

            finalServiceOrderItems = selectedOrder.initialServiceOrderItems.map((item, index) => ({
                package: item.package._id,
                quantity: values2[`serviceQuantity${index}`] !== undefined ? values2[`serviceQuantity${index}`] : item.quantity,
            })).filter(item => item.quantity > 0);
        }
        else {
            finalSalesOrderItems = selectedOrder.initialSalesOrderItems?.map(item => ({
                package: item.package._id,
                quantity: item.quantity
            }));
            finalServiceOrderItems = selectedOrder.initialServiceOrderItems?.map(item => ({
                package: item.package._id,
                quantity: item.quantity
            }));
        }
        const values = await teamResponseForm.validateFields();
        const payload = {
            teamCode: values.code,
            teamComments: values.comments,
            dtNumber: values.dtNumber,
            wptsNumber: values.wptsNumber,
            cparNumber: values.cparNumber,
            status: 'approved',
            finalSalesOrderItems,
            finalServiceOrderItems,
            engineers
        };
        dispatch(ShowLoading());
        try {
            const response = await orderService.completeOrder(selectedOrder._id, payload);
            message.success(response);
            fetchOrderDetails();
            handleReset();
        } catch (error) {
            message.error(error.response.data);
        }
        dispatch(HideLoading());
    };

    return (
        <div className='view-order'>
            {selectedOrder && (
                <div>
                    <div className="order-section">
                        <h3>Client Information</h3>
                        <p><strong>Car Chassis Number:</strong> {selectedOrder.clientInfo.carChassisNumber}</p>
                        <p><strong>Car Model:</strong> {selectedOrder.clientInfo.carModel}</p>
                        <p><strong>Car Number:</strong> {selectedOrder.clientInfo.carNumber}</p>
                        <p><strong>Contact Number:</strong> {selectedOrder.clientInfo.contactNumber}</p>
                        <p><strong>Customer Name:</strong> {selectedOrder.clientInfo.customerName}</p>
                        <p><strong>Location:</strong> {selectedOrder.clientInfo.location}</p>
                        <p><strong>MR Number:</strong> {selectedOrder.clientInfo.mrNumber}</p>
                        <p><strong>RO Number:</strong> {selectedOrder.clientInfo.roNumber}</p>
                        <p><strong>Order Creation Date:</strong> {new Date(selectedOrder.createdAt).toDateString()}</p>
                    </div>

                    <div className="order-section">
                        <h3>Initial Sales Order Items</h3>
                        <Table
                            columns={memoizedSalesColumns}
                            dataSource={selectedOrder.initialSalesOrderItems.map((item, index) => ({
                                ...item,
                                key: index,
                            }))}
                            rowKey="key"
                            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                            scroll={selectedOrder.initialSalesOrderItems.length > 10 ? { y: 400 } : undefined}
                        />
                    </div>

                    <div className="order-section">
                        <h3>Initial Service Order Items</h3>
                        <Table
                            columns={memoizedServiceColumns}
                            dataSource={selectedOrder.initialServiceOrderItems.map((item, index) => ({
                                ...item,
                                key: index,
                            }))}
                            rowKey="key"
                            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                            scroll={selectedOrder.initialServiceOrderItems.length > 10 ? { y: 400 } : undefined}
                        />
                    </div>

                    {selectedOrder.status === 'completed' && (
                        <>
                            <div className="order-section">
                                <h3>Final Sales Order Items</h3>
                                <Table
                                    columns={memoizedSalesColumns}
                                    dataSource={selectedOrder.finalSalesOrderItems.map((item, index) => ({
                                        ...item,
                                        key: index,
                                    }))}
                                    rowKey="key"
                                    pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                                    scroll={selectedOrder.finalSalesOrderItems.length > 10 ? { y: 400 } : undefined}
                                />
                            </div>

                            <div className="order-section">
                                <h3>Final Service Order Items</h3>
                                <Table
                                    columns={memoizedServiceColumns}
                                    dataSource={selectedOrder.finalServiceOrderItems.map((item, index) => ({
                                        ...item,
                                        key: index,
                                    }))}
                                    rowKey="key"
                                    pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                                    scroll={selectedOrder.finalServiceOrderItems.length > 10 ? { y: 400 } : undefined}
                                />
                            </div>
                        </>
                    )}

                    <div className="order-section">
                        <h3>Team Responses</h3>
                        {selectedOrder.teamResponses.map((response, index) => (
                            <div key={index} className="order-item">
                                <p><strong>Team Name:</strong> {response.teamName}</p>
                                <p><strong>User:</strong> {response.user.name} ({response.user.email})</p>
                                <p><strong>Status:</strong> {response.status}</p>
                                <p><strong>Comments:</strong> {response.comments}</p>
                                <p><strong>DT Number:</strong> {selectedOrder.dtNumber || ''}</p>
                            </div>
                        ))}
                    </div>
                    {(selectedOrder.status === 'completed' && selectedOrder.engineers && selectedOrder.engineers.length > 0) &&
                        <div className="order-section">
                            <h3>Engineers List</h3>
                            {selectedOrder.engineers.map((engineer, index) => (
                                <div key={index} className="order-item">
                                    <p><strong>Item:</strong> {engineer.item}</p>
                                    <p><strong>Name:</strong> {engineer.name}</p>
                                    <p><strong>Id:</strong> {engineer.id}</p>
                                    <p><strong>Position:</strong> {engineer.position}</p>
                                </div>
                            ))}
                        </div>
                    }
                    {((selectedOrder.currentTeamProcessing === 'field_operation' && (userTeam === 'field_operation' || userTeam === 'admin')) && selectedOrder.status === 'processing') &&
                        <div className='order-section'>
                            <h3>Engineers List</h3>
                            <EngineersList data={engineers} setData={setEngineers} />
                        </div>
                    }
                    {((selectedOrder.currentTeamProcessing === userTeam || userTeam === 'admin') && selectedOrder.status === 'processing') &&
                        <>
                            <h3 className='head-res'>Response</h3>
                            <TeamResponseForm form={teamResponseForm} className="team-response-form" />
                            <div className='flex-btns'>
                                <Upload action={''}>
                                    <Button icon={<MdOutlineFileUpload size={24} />} className='flex'>Upload</Button>
                                </Upload>
                                {selectedOrder.currentTeamProcessing !== 'field_operation' ? (
                                    <>
                                        <Button type="primary" onClick={() => handleUpdateTeamResponse('approved')}>Approve</Button>
                                        <Button type="primary" danger onClick={() => handleUpdateTeamResponse('rejected')}>Return</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button type="primary" onClick={() => handleCompleteOrder('no-changes')}>Approve</Button>
                                        <Button type="primary" onClick={() => setIsChangeModalVisible(true)}>Approve with Changes</Button>
                                        <Button type="primary" danger onClick={() => handleUpdateTeamResponse('rejected')}>Return</Button>
                                    </>
                                )}
                            </div>
                        </>
                    }
                </div>
            )}
            <Modal
                title="Approve with Changes"
                open={isChangeModalVisible}
                onCancel={() => setIsChangeModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsChangeModalVisible(false)}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => handleCompleteOrder('changes')}>
                        Submit
                    </Button>,
                ]}
            >
                {selectedOrder && (
                    <Form form={changeForm} layout="vertical">
                        <h3>Sales Order Items</h3>
                        {selectedOrder.initialSalesOrderItems.map((item, index) => (
                            <Form.Item key={index} label={item.package.description} name={`salesQuantity${index}`}>
                                <InputNumber min={0} defaultValue={item.quantity} />
                            </Form.Item>
                        ))}
                        <h3>Service Order Items</h3>
                        {selectedOrder.initialServiceOrderItems.map((item, index) => (
                            <Form.Item key={index} label={item.package.description} name={`serviceQuantity${index}`}>
                                <InputNumber min={0} defaultValue={item.quantity} />
                            </Form.Item>
                        ))}
                    </Form>
                )}
            </Modal>
        </div>
    )
});

export default ViewOrder;