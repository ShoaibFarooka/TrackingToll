import React from 'react';
import { Form, Input } from 'antd';

const TeamResponseForm = React.memo(({ form }) => (
    <Form
        form={form}
        layout="vertical"
        initialValues={{
            dtNumber: '',
            wptsNumber: '',
            cparNumber: ''
        }}
    >
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="dtNumber" label="DT Number" rules={[{ required: false }]}>
            <Input />
        </Form.Item>
        <Form.Item name="wptsNumber" label="WPTS Number" rules={[{ required: false }]}>
            <Input />
        </Form.Item>
        <Form.Item name="cparNumber" label="CPAR Number" rules={[{ required: false }]}>
            <Input />
        </Form.Item>
        <Form.Item name="comments" label="Comments" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
        </Form.Item>
    </Form>
));

export default TeamResponseForm;
