import React from 'react';
import './toolbarbutton.css';
const ToolBarButton = ({ onClick, text, icon}) => {
  return (
    <div className='toolbar-button' onClick={onClick}>
        <img src={icon} alt='Toolbar Icon' width={28} height={28} />
        <p> {text} </p>
    </div>
  )
};

export default ToolBarButton;