import React from 'react';
import './SelectOption.css';
import { Select } from 'antd';

const { Option } = Select;

const SelectOption = React.memo(({ setValue, OptionsData, placeholder }) => {

    const handleChange = (value) => {
        setValue(value);
    };

    return (
        <div className='select-option-container'>
            <Select defaultValue="" onChange={handleChange} placeholder={placeholder} className='select-option'>
                {OptionsData.map((option, index) => (
                    <Option key={index} value={option.value}>{option.text}</Option>
                ))}
            </Select>
        </div>
    )
});

export default SelectOption;