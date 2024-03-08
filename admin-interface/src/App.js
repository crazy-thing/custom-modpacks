import React, { useEffect, useState } from 'react';
import { CreateModpack, Modpack, NavBar, ConfirmDelete, CreateVersion } from './components/exports';
import { deleteModpack, getAllModpacks, uploadModpack, editModpack } from './util/api';
import './App.css';
import { readConfig } from './util/configReader';
// Create collections
// Context menu
// Download packs

function App() {
  const [showCreateModpack, setShowCreateModpack] = useState(false);
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [allModpacks, setAllModpacks] = useState([]);
  const [selectedModpack, setSelectedModpack] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupOverlayActive, setPopupOverlayActive] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [uploadsUrl, setUploadsUrl] = useState('');
  const [modpackInfo, setModpackInfo] = useState({
    id: Date.now(),
    name: '',
    description: '',
    thumbnail: '',
    versions: [],    
  });
  const [editVersion, setEditVersion] = useState({
    name: '',
    size: '',
    id: Date.now(),
    zipFile: '',
    mcVersion: '',
    modLoader: '',
    modName: '',
  })
  const [isEditVersion, setIsEditVersion] = useState(false);

  useEffect(() => {
    const body = document.querySelector('body');
    if (popupOverlayActive) {
      body.classList.add('popup-overlay-active');
    } else {
      body.classList.remove('popup-overlay-active');
    }
  }, [popupOverlayActive]);

  useEffect(() => {
    const fetchDataWithConfig = async () => {
      try {
        const config = await readConfig();
        if (config.port && config.apiUrl) {
          const url = `http://127.0.0.1:${config.port}${config.apiUrl}`;
          setBaseUrl(url);
          setUploadsUrl(`http://127.0.0.1:${config.port}/uploads/`)
          fetchData(url);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
      }
    };
  
    fetchDataWithConfig();
  }, []);


  const fetchData = async (url) => {
    const modpacks = await getAllModpacks(url);
    setAllModpacks(modpacks);
  };

  const toggleShowCreateModpack = (modpack) => {
    setSelectedModpack(modpack || null);
    if (modpack) {
      setModpackInfo(modpack);
    }
    else {
      setModpackInfo({
        id: Date.now(),
        name: '',
        description: '',
        thumbnail: '',
        versions: [],          
      })
    }

    setIsEdit(!!modpack);
    setShowCreateModpack((prev) => !prev);
    setPopupOverlayActive((prev) => !prev);
    if (showCreateModpack) {
      fetchData(baseUrl);
    }
  };
  const toggleShowCreateVersion = (version) => {
    setEditVersion(version || null);
    if (version.name !== undefined){
      setIsEditVersion(true);
    }
    else {
      setIsEditVersion(false);
    }

    setShowCreateVersion((prev) => !prev);
    setPopupOverlayActive((prev) => !prev);
    if (showCreateVersion) {
      fetchData(baseUrl);
    }
  };

  const toggleShowConfirmDelete = (modpack) => {
    setSelectedModpack(modpack);
    setShowConfirmDelete((prev) => !prev);
    setPopupOverlayActive((prev) => !prev);
  };

  const handleCreate = async () => {
    try {
      let res;
      if (isEdit) {
        console.log("edited mopack info", modpackInfo);
        res = await editModpack(modpackInfo, baseUrl);
      } else {
        console.log(modpackInfo);
        res = await uploadModpack(modpackInfo, baseUrl);
      }
      console.log('Modpack uploaded successfully: ', res);
    } catch (error) {
      console.error('Error uploading modpack: ', error);
    } finally {
      toggleShowCreateModpack(null);
      setModpackInfo({
        id: Date.now(),
        name: '',
        description: '',
        thumbnail: '',
        versions: [],  
      })
    }
  };

  const handleInputChange = (fieldName, value) => {
    setModpackInfo((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleVersionChange = (newVersion) => {
    const existingVersionIndex = modpackInfo.versions.findIndex(ver => ver.id === newVersion.id);
  
    if (existingVersionIndex !== -1) {
      const updatedModpackInfo = {
        ...modpackInfo,
        versions: modpackInfo.versions.map((ver, index) => {
          if (index === existingVersionIndex) {
            return newVersion; 
          } else {
            return ver;
          }
        })
      };
      setModpackInfo(updatedModpackInfo);
    } else {

      const updatedModpackInfo = {
        ...modpackInfo,
        versions: [...modpackInfo.versions, newVersion]
      };
      console.log(updatedModpackInfo);
      setModpackInfo(updatedModpackInfo);
    }
  
    setShowCreateVersion(false);
  };

  const deletePack = async (modpack) => {
    const deleteResult = await deleteModpack(modpack, baseUrl);
    if (deleteResult) {
      console.log('Deleted modpack: ', modpack.id);
      setShowConfirmDelete(false);
      fetchData(baseUrl);
    }
  };

  const getFilteredModpacks = () => {
    return allModpacks.filter((modpack) =>
      modpack.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderModpackRows = (modpacks) => {
    return modpacks.map((modpack, index) => {
      if (index % 5 === 0) {
        return (
          <div className="app-modpacks-row" key={`row-${index}`}>
            {modpacks.slice(index, index + 5).map(renderModpack)}
          </div>
        );
      }
      return null;
    });
  };

  const renderModpack = (modpack) => (
    <Modpack
      key={modpack.id}
      modpack={modpack}
      deletePack={toggleShowConfirmDelete}
      toggleShowCreateModpack={toggleShowCreateModpack}
      uploadsUrl={uploadsUrl}
    />
  );

  return (
    <div className="App">
      <NavBar toggleShowCreateModpack={toggleShowCreateModpack} onChange={setSearchTerm} />

      {showCreateModpack && (
        <div className="popup-overlay">
          <CreateModpack
            close={toggleShowCreateModpack}
            modpack={modpackInfo}
            isEdit={isEdit}
            uploadsUrl={uploadsUrl}
            toggleShowCreateVersion={toggleShowCreateVersion}
            handleInputChange={handleInputChange}
            handleCreate={handleCreate}
            baseUrl={baseUrl}
          />
        </div>
      )}

      {showCreateVersion && (
        <div className='popup-overlay'>
          <CreateVersion 
            close={toggleShowCreateVersion}
            isEdit={isEdit}
            handleVersionChange={handleVersionChange}
            editVersion={isEdit ? editVersion : null}
            isEditVersion={isEditVersion}
          />
        </div>
      )}

      {showConfirmDelete && (
          <ConfirmDelete toggleShowConfirmDelete={toggleShowConfirmDelete} deletePack={deletePack} selectedModpack={selectedModpack} />
      )}

      <div className="app-modpacks">
        {allModpacks.length > 0 ? (
          searchTerm ? renderModpackRows(getFilteredModpacks()) : renderModpackRows(allModpacks)
        ) : (
          <p className='app-modpacks-none'>No modpacks available.</p>
        )}
      </div>
    </div>
  );
}

export default App;
