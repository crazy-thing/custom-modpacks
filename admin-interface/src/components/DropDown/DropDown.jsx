import React, { useEffect, useRef, useState } from 'react';
import './dropdown.css';
import { deleteIcon } from '../../assets/exports';
import { ConfirmDelete } from '../exports';

const DropDown = ({ width = 'auto', height = 'auto', fontSize = 'inherit', options = [], value, onChange, modpack, isVersions, versions, toggleShowCreateVersion, baseUrl, handleInputChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [selectedVersion, setSelectedVersion] = useState({});
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
    
    const toggleShowConfirmDelete = (event, version = null, newVersions = null) => {
        event.stopPropagation();
        if (version !== null) {
            setSelectedVersion(version);
        } 
        if (newVersions !== null) {
            handleInputChange('versions', newVersions);
            console.log("changed versions to: ", newVersions);
        }
        setShowConfirmDelete(!showConfirmDelete);
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
        {showConfirmDelete && (
            <ConfirmDelete 
                isVersions={isVersions}
                toggleShowConfirmDelete={toggleShowConfirmDelete}
                selectedModpack={modpack}
                selectedVersion={selectedVersion}
                versions={versions}
                baseUrl={baseUrl}
            />
        )}

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
                        <img src={deleteIcon} width={20} height={20} onClick={(event) => toggleShowConfirmDelete(event, version)} />
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