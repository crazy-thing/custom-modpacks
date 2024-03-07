import React, { useState, useRef, useEffect } from 'react';
import { cloud } from '../../assets/exports';
import { UploadedFile } from '../exports';
import './fileupload.css';


const FileUpload = ({ onChange, version, isEdit, isEditVersion }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedVersion, setUploadedVersion] = useState({
        zip: '',
        size: '',
    });
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleDragEnter = () => {
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleVersion = (newVersion) => {
        if (!newVersion.name.toLowerCase().endsWith('.zip')) {
            console.error('Invalid file type. Please upload a ZIP file.');
            return;
        }
        setUploadedVersion({
            zip: newVersion.name,
            size: newVersion.size,
        });
        console.log(version);
        onChange('zipFile', newVersion);
        onChange('zip', newVersion.name);
        onChange('size', newVersion.size);
        const reader = new FileReader();
        reader.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                setUploadProgress(progress);
            }
        };
        reader.onloadend = () => {
            console.log('Reading finished');
        };
        reader.readAsDataURL(newVersion);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        handleVersion(files[0]);
    };

    const handleFileInputChange = (event) => {
        const files = event.target.files;
        handleVersion(files[0]);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const removeVersion = () => {
        checkForEdit();
        setUploadProgress(0);
        setUploadedVersion({
            zip: '',
            size: '',
        });
        onChange('zip', '');
        onChange('size', '');
    };

    const checkForEdit = () => {
        if (isEditVersion && version.zip !== '') {
            setUploadedVersion({
                zip: version.zip,
                size: version.size,
            });
            setUploadProgress(100);
        }
        else {
            setUploadProgress(0);
        }       
    }

    useEffect(() => {
        checkForEdit();
    }, [version]);


    return (
        <>
            {uploadProgress > 0 ? (
                <UploadedFile uploadedVersion={uploadedVersion} removeVersion={removeVersion} progress={uploadProgress} isEdit={isEdit} />
            ) : (
                <div
                    className={`file-upload ${isDragging ? 'dragging' : ''}`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <div className='file-upload-content'>
                        <img src={cloud} alt='Cloud upload icon' width={28} height={28} />
                        <p className='file-upload-content-text'>Drop files here or click to upload</p>
                    </div>
                    <input
                        type='file'
                        accept='.zip'
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                    />
                </div>
            )}
        </>
    );
};

export default FileUpload;