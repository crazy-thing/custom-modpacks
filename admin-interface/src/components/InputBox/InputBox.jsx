import React from 'react';
import './inputbox.css';

const InputBox = ({ width, height, fontSize, placeHolder, type, value, onChange }) => {
    const inputBoxStyle = {
        width,
        height,
        fontSize,
    };

    const textAreaBoxStyle = {
        ...inputBoxStyle,
        padding: '0%',
        paddingTop: '.5rem',
        paddingLeft: '.5rem',
    };

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (onChange) {
            onChange(newValue);
        }
    };

    const inputElement = type === 'textarea' ? (
        <textarea className='input-box' placeholder={placeHolder} style={textAreaBoxStyle} value={value} onChange={handleChange} />
    ) : (
        <input className='input-box' placeholder={placeHolder} style={inputBoxStyle} value={value} onChange={handleChange} />
    );

    return inputElement;
};

export default InputBox;
