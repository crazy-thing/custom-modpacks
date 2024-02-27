import React from 'react';
import './button.css';

const Button = ({ onClick, type = 'default', width = 'auto', height = 'auto', text, fontSize = 'inherit' }) => {

    const buttonColors = {
      confirm: '#0A8AE8',
      delete: '#EB5757',
      cancel: '#0c0c0c',
      default: '#0A8AE8', 
    };

    const buttonStyle = {
        background: buttonColors[type],
        width,
        height,
    };

    const textStyle = {
      fontSize,
      color: type === "delete" ? '#000' : "#fff",
    };

  return (
    <div className='button' style={buttonStyle} onClick={onClick}>
        <p className='button-text' style={textStyle}> {text} </p>
    </div>
  )
};

export default Button;