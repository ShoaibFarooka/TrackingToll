import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const { Option } = Select;

const UserFormModal = ({ form, isModalVisible, handleSave, handleCancel, editingUser }) => {
    return (
        <Modal
            title={editingUser ? "Edit User" : "Add User"}
            open={isModalVisible}
            onOk={handleSave}
            onCancel={handleCancel}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input the email!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="team" label="Team" rules={[{ required: true, message: 'Please select the team!' }]}>
                    <Select>
                        <Option value="sales">Sales</Option>
                        <Option value="application">Application</Option>
                        <Option value="operations_support">Operations Support</Option>
                        <Option value="asset_inventory">Asset Inventory</Option>
                        <Option value="repair_maintenance">Repair Maintenance</Option>
                        <Option value="logistics">Logistics</Option>
                        <Option value="field_operation">Field Operation</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: !editingUser, message: 'Please input the password!' }]}>
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UserFormModal;
