import React from 'react';
import { Form, Input } from 'antd';

const SearchForm = React.memo(({ form, onChange, fields }) => (
    <Form form={form} layout="inline">
        {fields.map(field => (
            <Form.Item key={field.name} name={field.name}>
                <Input placeholder={field.placeholder} onChange={onChange} />
            </Form.Item>
        ))}
    </Form>
));

export default SearchForm;
