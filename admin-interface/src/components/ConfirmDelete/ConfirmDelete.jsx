import React from 'react';
import { Button } from '../exports';
import './confirmdelete.css';

const ConfirmDelete = ({ toggleShowConfirmDelete, deletePack, selectedModpack, isVersions, selectedVersion, baseUrl, versions }) => {

    const handleDeleteVersion = async (event) => {
        const updatedVersions = versions.filter(version => version.id !== selectedVersion.id);
        toggleShowConfirmDelete(event, null, updatedVersions);
    }

    return (
        <div className='popup-overlay'>
            <div className='confirm-delete'>
                <p className='confirm-delete-header'>Confirm Deletion</p>
                <p className='confirm-delete-body'>Are you sure you want to permanently delete this item?</p>
                <div className='confirm-delete-buttons'>
                    <Button width={75} height={18} fontSize="14px" text="Cancel" type="cancel" onClick={toggleShowConfirmDelete} />
                    {isVersions ? (
                        <Button width={75} height={18} fontSize="14px" text="Delete" type="delete" onClick={(event) => handleDeleteVersion(event)} />
                    ) : (
                        <Button width={75} height={18} fontSize="14px" text="Delete" type="delete" onClick={() => deletePack(selectedModpack)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConfirmDelete;