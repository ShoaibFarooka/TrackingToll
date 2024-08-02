import React from 'react';
import { Button } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';

const createOrderColumns = (handleViewOrder, handleGeneratePDF, handleDeleteOrder, userTeam) => [
    {
        title: 'Order ID',
        dataIndex: '_id',
        key: '_id',
    },
    {
        title: 'Customer Name',
        dataIndex: ['clientInfo', 'customerName'],
        key: 'customerName',
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Current Team Processing',
        dataIndex: 'currentTeamProcessing',
        key: 'currentTeamProcessing',
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
            <>
                <Button onClick={() => handleViewOrder(record)} style={{ marginRight: 8 }}>View</Button>
                <Button onClick={() => handleGeneratePDF(record)} style={{ marginRight: 8 }} type="primary" icon={<FilePdfOutlined />}>PDF</Button>
                {(userTeam === 'sales' || userTeam === 'admin') &&
                    <Button onClick={() => handleDeleteOrder(record)} type="primary" danger>Delete</Button>
                }
            </>
        ),
    },
];

export default createOrderColumns;
