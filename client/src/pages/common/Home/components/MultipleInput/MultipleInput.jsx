import React, { useState } from 'react';
import './MultipleInput.css';
import { Input } from 'antd';
import { AiOutlineClose } from "react-icons/ai";

const MultipleInput = React.memo(({ tags, setTags, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && !tags.includes(inputValue)) {
            setTags([...tags, inputValue.trim()]);
            setInputValue('');
        }
    };

    const handleTagClose = (removedTag) => {
        const updatedTags = tags.filter((tag) => tag !== removedTag);
        setTags(updatedTags);
    };

    return (
        <div className="multiple-input-container">
            <Input
                className="multiple-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputConfirm}
                onPressEnter={handleInputConfirm}
                placeholder={placeholder}
            />
            {(tags && tags.length > 0) &&
                <div className='tags'>
                    {tags.map((tag, index) => (
                        <div key={index} className='tag-style'>
                            <div className='tag-text'>{tag}</div>
                            <AiOutlineClose onClick={() => handleTagClose(tag)} size={12} className='tag-cross' />
                        </div>
                    ))}
                </div>
            }
        </div>
    );
});

export default MultipleInput;
