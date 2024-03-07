import React, { useEffect, useRef, useState } from 'react';
import './dropdown.css';

const DropDown = ({ width = 'auto', height = 'auto', fontSize = 'inherit', options = [], value, onChange, isVersions, versions, toggleShowCreateVersion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropDownRef = useRef(null);

    const handleOptionsClick = (option) => {
        if (isVersions)
        {

            setIsOpen(false);
            return;
        }
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
        <>
        {isVersions ? ( 
            <div className={`dropdown ${isOpen ? 'open' : ''}`} style={dropDownBoxStyle} ref={dropDownRef} onClick={() => setIsOpen(!isOpen)}>
            <div className='dropdown-selected-option'>
                {value || 'View Versions'}
                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}> &#9660; </span>
            </div>
            <div className={`dropdown-options ${isOpen ? 'open' : ''}`}>
                {versions.map((version) => (
                    <div
                        key={version.id}
                        className={`dropdown-options-option ${version === value ? 'selected' : ''}`}
                        onClick={() => toggleShowCreateVersion(version)}
                    >
                        {version.name}
                    </div>
                ))}
            </div>
        </div>
        ) : (
            <div className={`dropdown ${isOpen ? 'open' : ''}`} style={dropDownBoxStyle} ref={dropDownRef} onClick={() => setIsOpen(!isOpen)}>
                <div className='dropdown-selected-option'>
                    {value || 'Select a version'}
                    <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}> &#9660; </span>
                </div>
                <div className={`dropdown-options ${isOpen ? 'open' : ''}`}>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`dropdown-options-option ${option === value ? 'selected' : ''}`}
                            onClick={() => handleOptionsClick(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        )}
        </>
    );
};

export default DropDown;