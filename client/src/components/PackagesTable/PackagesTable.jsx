import React, { useState } from 'react';
import { Table, Popconfirm ,Button, InputNumber, message } from 'antd';

const PackagesTable = React.memo(({ columns, dataSource, onEditPackage, onDeletePackage, type, onAddToOrder }) => {
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (value, recordId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [recordId]: value,
        }));
    };

    const extendedColumns = [
        ...columns,
        onAddToOrder && {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text, record) => (
                <InputNumber
                    onChange={(value) => handleQuantityChange(value, record._id)}
                />
            ),
        },
        onAddToOrder && {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    type="link"
                    onClick={() => {
                        const quantity = quantities[record._id];
                        if (!quantity || quantity <= 0) {
                            message.error('Please enter a valid quantity.');
                        } else if (quantity > record.quantity) {
                            message.error('Not enough quantity left.');
                        } else {
                            onAddToOrder(record, quantity, type);
                        }
                    }}
                >
                    Add to Order
                </Button>
            ),
        },
        onEditPackage && {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button type="link" onClick={() => onEditPackage(record, type)}>Edit</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => onDeletePackage(record, type)}>
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ].filter(Boolean);

    return (
        <Table
            columns={extendedColumns}
            dataSource={dataSource}
            rowKey="_id"
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
            scroll={dataSource.length > 10 ? { y: 400 } : undefined}
            />
    );
});

export default PackagesTable;
