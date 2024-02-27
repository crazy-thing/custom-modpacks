import React from 'react';
import { fileIcon, deleteIcon } from '../../assets/exports';
import './uploadedfile.css';

const UploadedFile = ({ uploadedModpack, removeModpack, progress, noEdit }) => {

  const modpackSize = () => {
    try {
      let size = uploadedModpack.size;
      const suffixes = ['KB', 'MB', 'GB'];

      let i = -1;
      while (size >= 1000 && i < suffixes.length - 1) {
        size /= 1000;
        i++;
      }

      return `(${size.toFixed(2)} ${suffixes[i]})`;
    } catch (error) {
      console.error('Failed to calculate modpack zip file size: ', error);
    }
  };

  return (
    <>
      {noEdit ? (
        <div className='uploaded-file'>
          <img src={fileIcon} alt='File Icon' width={24} height={26} />
          <div className='uploaded-file-content'>
            <div className='uploaded-file-content-info'>
              <p className='uploaded-file-content-info-text'>{uploadedModpack.modpack} {modpackSize()}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className='uploaded-file'>
          <img src={fileIcon} alt='File Icon' width={30} height={38} />
          <div className='uploaded-file-content'>
            <div className='uploaded-file-content-info'>
              <p className='uploaded-file-content-info-text'>{uploadedModpack.modpack} {modpackSize()}</p>
              <img className='uploaded-file-content-info-delete' src={deleteIcon} alt='Delete Icon' width={20} height={21} onClick={removeModpack} />
            </div>
            <progress value={progress} max='100' className='uploaded-file-progress'>
              {progress}%
            </progress>
          </div>
        </div>
      )}
    </>
  )
};

export default UploadedFile;