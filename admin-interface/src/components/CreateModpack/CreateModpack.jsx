import React, { useEffect, useState } from 'react';
import { InputBox, ImageUpload, FileUpload, Button, DropDown} from '../exports';
import { uploadModpack, editModpack } from '../../util/api';
import { getFabricLoaders } from '../../util/fabricApi';
import { getVanillaVersions } from '../../util/vanillaApi';
import './createmodpack.css';


const CreateModpack = ({ close, modpack, isEdit, baseUrl, uploadsUrl }) => {
  const expressServerAdd = uploadsUrl;

  const [modpackInfo, setModpackInfo] = useState({
    name: '',
    version: '',
    mcVersion: '',
    fabricVersion: '',
    description: '',
    thumbnail: '',
    modpack: '',
    size: '',
  });
  const [fabricLoaders, setFabricLoaders] = useState([]);
  const [vanillaVersions, setVanillaVersions] = useState([]);

  const handleInputChange = (fieldName, value) => {
    setModpackInfo((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      let res;
      if (isEdit) {
        res = await editModpack(modpackInfo, baseUrl);
      } else {
        res = await uploadModpack(modpackInfo, baseUrl);
      }
      console.log('Modpack uploaded successfully: ', res);
    } catch (error) {
      console.error('Error uploading modpack: ', error);
    } finally {
      close(null);
    }
  };

  const fetchOptions = async () => {
    try {
      const vanVersions = await getVanillaVersions();
      const fabLoaders = await getFabricLoaders();

      setVanillaVersions(vanVersions);
      setFabricLoaders(fabLoaders);
    } catch (error) {
      console.error('Error fetching fabric versions: ', error);
    }
  };

  useEffect(() => {
    fetchOptions();

    if (isEdit) {
      setModpackInfo(modpack);
    }
  }, []);

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
          <div className='create-modpack-info-inputs'>
            <div className='create-modpack-info-inputs-container'>
              <p className='create-modpack-info-inputs-headers'>Modpack Name</p>
              <InputBox
                width={200}
                height={20}
                fontSize='16px'
                placeHolder='Enter modpack name'
                value={modpackInfo.name}
                onChange={(value) => handleInputChange('name', value)}
              />
            </div>
            <div className='create-modpack-info-inputs-container'>
              <p className='create-modpack-info-inputs-headers'>Modpack Version</p>
              <InputBox
                width={200}
                height={20}
                fontSize='16px'
                placeHolder='Enter modpack version'
                value={modpackInfo.version}
                onChange={(value) => handleInputChange('version', value)}
              />
            </div>
          </div>
          <div className='create-modpack-info-inputs'>
            <div className='create-modpack-info-inputs-container'>
              <p className='create-modpack-info-inputs-headers'>Minecraft Version</p>
              <DropDown
                width={200}
                height={20}
                fontSize='16px'
                placeHolder='Enter Minecraft version'
                value={modpackInfo.mcVersion}
                onChange={(value) => handleInputChange('mcVersion', value)}
                options={vanillaVersions}
              />
            </div>
            <div className='create-modpack-info-inputs-container'>
              <p className='create-modpack-info-inputs-headers'>Fabric Version</p>
              <DropDown
                width={200}
                height={20}
                fontSize='16px'
                placeHolder='Enter Fabric version'
                value={modpackInfo.fabricVersion}
                onChange={(value) => handleInputChange('fabricVersion', value)}
                options={fabricLoaders}
              />
            </div>
          </div>
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
          value={modpackInfo.description}
          onChange={(value) => handleInputChange('description', value)}
        />
      </div>
      <div className='create-modpack-file-upload'>
        <p className='create-modpack-file-upload-header'>Modpack Zip File</p>
        <FileUpload onChange={handleInputChange} modpack={modpack} />
      </div>
      <div className='create-modpack-buttons'>
        <Button width={90} height={27} text='Cancel' fontSize='14px' type='cancel' onClick={() => close(null)} />
        <Button width={90} height={27} text={isEdit ? 'Save' : 'Create'} fontSize='14px' type='confirm' onClick={handleCreate} />
      </div>
    </div>
  );
};

export default CreateModpack;