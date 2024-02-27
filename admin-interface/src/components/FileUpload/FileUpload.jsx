import React, { useState, useRef, useEffect } from 'react';
import { cloud } from '../../assets/exports';
import { UploadedFile } from '../exports';
import './fileupload.css';


const FileUpload = ({ onChange, modpack }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedModpack, setUploadedModpack] = useState({
        name: '',
        version: '',
        mcVersion: '',
        fabricVersion: '',
        description: '',
        thumbnail: '',
        modpack: '',
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

    const handleModpack = (modpack) => {
        if (!modpack.name.toLowerCase().endsWith('.zip')) {
            console.error('Invalid file type. Please upload a ZIP file.');
            return;
        }
        setUploadedModpack({
            modpack: modpack.name,
            size: modpack.size,
        });
        onChange('modpack', modpack);
        onChange('size', modpack.size);
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
        reader.readAsDataURL(modpack);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = event.dataTransfer.files;
        handleModpack(files[0]);
    };

    const handleFileInputChange = (event) => {
        const files = event.target.files;
        handleModpack(files[0]);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const removeModpack = () => {
        setUploadProgress(0);
        setUploadedModpack({
            name: '',
            version: '',
            mcVersion: '',
            fabricVersion: '',
            description: '',
            thumbnail: '',
            modpack: '',
            size: '',
        });
        onChange('modpack', '');
        onChange('size', '');
    };

    useEffect(() => {
        if (modpack) {
            setUploadedModpack(modpack);
            setUploadProgress(100);
        }
    }, [modpack]);

    return (
        <>
            {uploadProgress > 0 ? (
                <UploadedFile uploadedModpack={uploadedModpack} removeModpack={removeModpack} progress={uploadProgress} />
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