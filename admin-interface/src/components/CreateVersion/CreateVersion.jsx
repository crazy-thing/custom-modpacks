import React, { useEffect, useState } from 'react';
import './createversion.css';
import { InputBox, FileUpload, Button, DropDown} from '../exports';
import { getVanillaVersions } from '../../util/vanillaApi';
import { fabricIcon, forgeIcon } from '../../assets/exports';

const CreateVersion = ({ close, isEdit, handleVersionChange, editVersion, isEditVersion}) => {

  const [version, setVersion] = useState({
    name: '',
    size: '',
    id: Date.now(),
    zipFile: '',
    mcVersion: '',
    modLoader: '',
    modName: '',
  });
  

  const [vanillaVersions, setVanillaVersions] = useState([]);
  const [activeModName, setActiveModName] = useState('Fabric');



  const handleVersion = (fieldName, value) => {
    setVersion((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };


  const toggleModLoader = () => {
    const newLoaderName = activeModName === 'Fabric' ? 'Forge' : 'Fabric'
    handleVersion('modName', newLoaderName);
    setActiveModName(newLoaderName);
  };


  const fetchOptions = async () => {
    try {
      const vanVersions = await getVanillaVersions();

      setVanillaVersions(vanVersions);
    } catch (error) {
      console.error('Error fetching vanilla versions: ', error);
    }
  };

  useEffect(() => {
    fetchOptions();

    if (isEditVersion) {
      setVersion(editVersion);
      if (editVersion.modName === undefined)
      {
        setActiveModName('Fabric');
        handleVersion('modName', activeModName);
      }
      else {
        setActiveModName(editVersion.modName);
        handleVersion('modName', activeModName);
      }
    }
    else {
      setActiveModName("Fabric");
      handleVersion('modName', activeModName);
    }
  }, []);

  return (
    <div className='create-version'>
            <div className='create-version-info-inputs-container'>
                <p className='create-version-info-inputs-headers'>Version</p>
                  <InputBox
                    width={320}
                    height={10}
                    fontSize='16px'
                    placeHolder='Enter Version'
                    value={version.name}
                    onChange={(value) => handleVersion('name', value)}
                  />   
            </div>

            <div className='create-version-info-inputs-container'>
              <p className='create-version-info-inputs-headers'>Minecraft Version</p>
              <DropDown
                width={320}
                height={10}
                fontSize='16px'
                placeHolder='Enter Minecraft version'
                value={version.mcVersion}
                onChange={(value) => handleVersion('mcVersion', value)}
                options={vanillaVersions}
              />
            </div>

            <div className='create-version-info-inputs-container'>
              <div className='create-version-info-inputs-headers-container'>
                <p className='create-version-info-inputs-headers'>{activeModName} Version</p>
                <img
                  className='create-version-info-inputs-headers-img'
                  src={activeModName === 'Fabric' ? fabricIcon : forgeIcon}
                  alt={activeModName === 'Fabric' ? 'Fabric' : 'Forge'}
                  onClick={toggleModLoader}
                  width={24}
                  height={24}
                />
              </div>
              <InputBox
                width={320}
                height={10}
                fontSize='16px'
                placeHolder='Enter Mod Loader'
                value={version.modLoader}
                onChange={(value) => handleVersion('modLoader', value)}
              />

          </div>
        <div className='create-version-file-upload'>
            <p className='create-version-file-upload-header'>Modpack Zip File</p>
            {isEditVersion ? (
              <FileUpload onChange={handleVersion} version={isEditVersion ? version : null} isEdit={isEdit} isEditVersion={isEditVersion} />
            ) : (
              <FileUpload onChange={handleVersion} />
            )}
      </div>

      <div className='create-version-buttons'>
        <Button width={90} height={27} text='Cancel' fontSize='14px' type='cancel' onClick={close} />
        <Button width={90} height={27} text={isEdit ? 'Save' : 'Confirm'} fontSize='14px' type='confirm' onClick={() => handleVersionChange(version)}  />
      </div>
    </div>
  )
};

export default CreateVersion;