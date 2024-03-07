import React from 'react';
import { UploadedFile, Button } from '../exports';
import { deleteIcon } from '../../assets/exports';
import './modpack.css';

const Modpack = ({ modpack, deletePack, toggleShowCreateModpack, uploadsUrl }) => {
    const expressServerAdd = uploadsUrl;

    return (
        <div className='modpack'>
            <div className='modpack-thumbnail'>
                <img src={expressServerAdd + modpack.thumbnail} alt='Modpack Thumbnail' width={350} height={200} />
            </div>
            <div className='modpack-content'>
                <div className='modpack-content-name-version'>
                    <p className='modpack-content-name'>{modpack.name}</p>
                    <p className='modpack-content-version'>{modpack.version}</p>
                </div>
                <div className='modpack-content-description'>
                    <p className='modpack-content-description-text'>{modpack.description}</p>
                </div>
                {/*
                <div className='modpack-content-zip'>
                    <UploadedFile noEdit={true} uploadedModpack={modpack} />
                </div>                
                */}
                <div className='modpack-content-buttons'>
                    <Button width={70} height={16} fontSize='11px' type='confirm' text='Edit Pack' onClick={() => toggleShowCreateModpack(modpack)} />
                    <img className='modpack-content-buttons-delete' src={deleteIcon} alt='Delete Button' width={20} height={20} onClick={() => deletePack(modpack)} />
                </div>
            </div>
        </div>
    );
};

export default Modpack;