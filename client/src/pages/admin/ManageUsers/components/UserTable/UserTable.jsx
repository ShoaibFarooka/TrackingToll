import React from 'react';
import { Table, Button, Popconfirm } from 'antd';

const UserTable = ({ users, handleEdit, handleDelete }) => {

    const columns = React.useMemo(() => [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Team',
            dataIndex: 'team',
            key: 'team',
            sorter: (a, b) => a.team.localeCompare(b.team),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record._id)}>
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ], [handleEdit, handleDelete]);

    return (
        <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        />
    );
};

export default UserTable;
