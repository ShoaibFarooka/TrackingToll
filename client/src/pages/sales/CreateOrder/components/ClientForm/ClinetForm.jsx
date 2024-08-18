import React from 'react';
import { Form, Input } from 'antd';

const initialValues = {
    mrNumber: '',
    roNumber: '',
    carNumber: '',
    carChassisNumber: '',
    carModel: '',
    location: '',
    customerName: '',
    contactNumber: ''
};

const ClientForm = React.memo(({ form }) => (
    <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item name="mrNumber" label="MR Number" rules={[{ required: false }]}>
            <Input />
        </Form.Item>
        <Form.Item name="roNumber" label="RO Number" rules={[{ required: false }]}>
            <Input />
        </Form.Item>
        <Form.Item name="carNumber" label="Car Number" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="carChassisNumber" label="Car Chassis Number" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="carModel" label="Car Model" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="location" label="Location" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="contactNumber" label="Contact Number" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
    </Form>
));

export default ClientForm;
