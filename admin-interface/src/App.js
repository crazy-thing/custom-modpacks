import React, { useEffect, useState } from 'react';
import { CreateModpack, Modpack, NavBar, ConfirmDelete } from './components/exports';
import { deleteModpack, getAllModpacks } from './util/api';

import './App.css';
import { readConfig } from './util/configReader';
// Create collections
// Context menu
// Download packs

function App() {
  const [showCreateModpack, setShowCreateModpack] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [allModpacks, setAllModpacks] = useState([]);
  const [selectedModpack, setSelectedModpack] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupOverlayActive, setPopupOverlayActive] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [uploadsUrl, setUploadsUrl] = useState('');

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
          console.log(config);
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
    setIsEdit(!!modpack);
    setShowCreateModpack((prev) => !prev);
    setPopupOverlayActive((prev) => !prev);
    if (showCreateModpack) {
      fetchData(baseUrl);
    }
  };

  const toggleShowConfirmDelete = (modpack) => {
    setSelectedModpack(modpack);
    setShowConfirmDelete((prev) => !prev);
    setPopupOverlayActive((prev) => !prev);
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
          <CreateModpack close={toggleShowCreateModpack} modpack={selectedModpack} isEdit={isEdit} baseUrl={baseUrl} uploadsUrl={uploadsUrl} />
        </div>
      )}

      {showConfirmDelete && (
        <div className="popup-overlay">
          <ConfirmDelete toggleShowConfirmDelete={toggleShowConfirmDelete} deletePack={deletePack} selectedModpack={selectedModpack} />
        </div>
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
