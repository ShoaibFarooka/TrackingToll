import React from 'react';
import { Form, Input } from 'antd';

const TeamResponseForm = React.memo(({ form }) => (
    <Form form={form} layout="vertical">
        <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
        </Form.Item>
        <Form.Item name="comments" label="Comments" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
        </Form.Item>
    </Form>
));

export default TeamResponseForm;
