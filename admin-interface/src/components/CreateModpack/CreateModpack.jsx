import React from 'react';
import { InputBox, ImageUpload, Button, DropDown} from '../exports';
import './createmodpack.css';

const CreateModpack = ({ close, modpack, isEdit, uploadsUrl, toggleShowCreateVersion, handleInputChange, handleCreate }) => {
  const expressServerAdd = uploadsUrl;

  return (
    <div className='create-modpack'>
      <p className='create-modpack-header'>{isEdit ? 'Edit Modpack' : 'Create Modpack'}</p>
      <div className='create-modpack-info'>
        <ImageUpload
          onChange={handleInputChange}
          selectedImg={isEdit ? `${expressServerAdd}${modpack.thumbnail}` : null}
          width={169}
          height={160}
        />
        <div className='create-modpack-info-container'>
              <p className='create-modpack-info-inputs-headers'>Modpack Name</p>
              <InputBox
                width={200}
                height={20}
                fontSize='16px'
                placeHolder='Enter modpack name'
                value={modpack.name}
                onChange={(value) => handleInputChange('name', value)}
              />
              <DropDown
                width={200}
                height={20}
                fontSize='16px'
                versions={modpack.versions}
                isVersions={true}
                toggleShowCreateVersion={toggleShowCreateVersion}
              />
              <Button width={194} height={20} text='Add Version' fontSize='14px' type='confirm' onClick={toggleShowCreateVersion} />

        </div>
      </div>
      <div className='create-modpack-description'>
        <p className='create-modpack-description-header'>Description</p>
        <InputBox
          type='textarea'
          width={"100%"}
          height={140}
          fontSize='16px'
          placeHolder='Enter modpack description'
          value={modpack.description}
          onChange={(value) => handleInputChange('description', value)}
        />
      </div>

      <div className='create-modpack-buttons'>
        <Button width={90} height={27} text='Cancel' fontSize='14px' type='cancel' onClick={() => close(null)} />
        <Button width={90} height={27} text={isEdit ? 'Save' : 'Create'} fontSize='14px' type='confirm' onClick={handleCreate} />
      </div>
    </div>
  );
  };






export default CreateModpack;

