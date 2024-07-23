import React from 'react';
import { Table, Popconfirm, Button } from 'antd';

const OrderSummary = React.memo(({ salesOrderItems, serviceOrderItems, handleDiscard }) => {
    const salesColumns = [
        {
            title: 'Car Code',
            dataIndex: 'carCode',
            key: 'carCode',
            render: carCode => carCode.join(', '),
        },
        { title: 'Part Num', dataIndex: 'partNum', key: 'partNum' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Unit Price (EGP)', dataIndex: 'unitPriceEGP', key: 'unitPriceEGP' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Total Price (EGP)', dataIndex: 'totalPriceEGP', key: 'totalPriceEGP' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Popconfirm title="Sure to discard?" onConfirm={() => handleDiscard(record._id, 'sales')}>
                    <Button type="link" danger>Discard</Button>
                </Popconfirm>
            ),
        },
    ];

    const serviceColumns = [
        { title: 'Car Code', dataIndex: 'carCode', key: 'carCode' },
        { title: 'Table Num', dataIndex: 'tableNum', key: 'tableNum' },
        { title: 'Item Num', dataIndex: 'itemNum', key: 'itemNum' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Unit Price (EGP)', dataIndex: 'unitPriceEGP', key: 'unitPriceEGP' },
        { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Total Price (EGP)', dataIndex: 'totalPriceEGP', key: 'totalPriceEGP' },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <Popconfirm title="Sure to discard?" onConfirm={() => handleDiscard(record._id, 'service')}>
                    <Button type="link" danger>Discard</Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div>
            <h4>Sales Order Items</h4>
            <Table columns={salesColumns} dataSource={salesOrderItems} pagination={false} rowKey="_id" />

            <h4>Service Order Items</h4>
            <Table columns={serviceColumns} dataSource={serviceOrderItems} pagination={false} rowKey="_id" />
        </div>
    );
});

export default OrderSummary;
