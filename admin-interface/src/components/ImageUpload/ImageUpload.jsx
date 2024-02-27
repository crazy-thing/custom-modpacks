import React, { useRef, useState } from 'react';
import { imagePlaceholder } from '../../assets/exports';
import './imageupload.css';

const ImageUpload = ({ onChange, width = 'auto', height = 'auto', selectedImg }) => {
  const [uploadedImage, setUploadedImage] = useState(selectedImg || null);
  const imageInputRef = useRef(null);

  const imageUploadStyle = {
    width,
    height,
  };

  const handleImageUpload = (thumbnail) => {
    onChange('thumbnail', thumbnail);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setUploadedImage(dataUrl);
    };
    reader.readAsDataURL(thumbnail);
  };

  const handleImageInputChange = (event) => {
    const thumbnail = event.target.files[0];
    handleImageUpload(thumbnail);
  };

  const handleClick = () => {
    imageInputRef.current.click();
  };

  return (
    <div className='image-upload' style={imageUploadStyle} onClick={handleClick}>
      {uploadedImage ? (
        <img className='image-upload-image' src={uploadedImage} alt='Uploaded Image' />
      ) : (
        <img className='image-upload-image' src={imagePlaceholder} alt='Please upload an image' />
      )}
      <input type='file' ref={imageInputRef} style={{ display: 'none' }} onChange={handleImageInputChange} accept='image/*' />
    </div>
  );
};

export default ImageUpload;
