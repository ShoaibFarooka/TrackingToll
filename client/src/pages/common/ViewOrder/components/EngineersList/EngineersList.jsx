import React from 'react';
import { Table, Button, Input } from 'antd';

const EngineersList = ({ data, setData }) => {

    const handleAdd = () => {
        const newData = {
            key: data.length + 1,
            item: '',
            name: '',
            id: '',
            position: '',
        };
        setData([...data, newData]);
    };

    const handleDelete = (key) => {
        setData(data.filter((item) => item.key !== key));
    };

    const handleInputChange = (key, dataIndex, value) => {
        const newData = [...data];
        const index = newData.findIndex((item) => key === item.key);
        if (index > -1) {
            newData[index][dataIndex] = value;
            setData(newData);
        }
    };

    const columns = [
        {
            title: 'Item',
            dataIndex: 'item',
            render: (_, record) => (
                <Input value={record.item} onChange={(e) => handleInputChange(record.key, 'item', e.target.value)} />
            ),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            render: (_, record) => (
                <Input value={record.name} onChange={(e) => handleInputChange(record.key, 'name', e.target.value)} />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'id',
            render: (_, record) => (
                <Input value={record.id} onChange={(e) => handleInputChange(record.key, 'id', e.target.value)} />
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            render: (_, record) => (
                <Input value={record.position} onChange={(e) => handleInputChange(record.key, 'position', e.target.value)} />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleDelete(record.key)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div>
            <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Add Row
            </Button>
            <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                bordered
                rowClassName="editable-row"
                size="middle"
            />
        </div>
    );
};

export default EngineersList;
