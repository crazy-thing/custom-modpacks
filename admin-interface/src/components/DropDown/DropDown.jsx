import React, { useEffect, useRef, useState } from 'react';
import './dropdown.css';

const DropDown = ({ width = 'auto', height = 'auto', fontSize = 'inherit', options = [], value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef(null);

    const handleOptionsClick = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    const dropDownBoxStyle = {
        width,
        height,
        fontSize,
    };

    const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={`dropdown ${isOpen ? 'open' : ''}`} style={dropDownBoxStyle} ref={dropDownRef}>
            <div className='dropdown-selected-option' onClick={() => setIsOpen(!isOpen)}>
                {value || 'Select a version'}
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}> &#9660; </span>
            </div>
            <div className={`dropdown-options ${isOpen ? 'open' : ''}`}>
                {options.map((option) => (
                    <div
                        key={option}
                        className={`dropdown-options-option ${option === value ? 'selected' : ''}`}
                        onClick={() => handleOptionsClick(option)}
                    >
                        {option}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DropDown;