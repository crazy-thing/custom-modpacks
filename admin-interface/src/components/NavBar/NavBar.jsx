import React from 'react';
import { ToolBarButton, SearchBar } from '../exports';
import { add } from '../../assets/exports';
import './navbar.css';

const NavBar = ({ toggleShowCreateModpack, onChange }) => {
  return (
    <div className='nav-bar'>
      <ToolBarButton text={"Create New Modpack"} icon={add} onClick={() => toggleShowCreateModpack(null)} />
      <SearchBar onChange={onChange} />
    </div>
  );
};

export default NavBar;
