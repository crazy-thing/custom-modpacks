const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Modpack = require('../models/modpack');
const {deleteFiles} = require('../helpers/deleteFiles');

const uploadsPath = path.join(process.cwd(), '/uploads');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
const upload = multer({ storage: storage });

// Get all modpacks
router.get('/', async (req, res) => {
    try {
      const modpacks = await Modpack.find();
      res.json(modpacks);
  
    } catch (error) {
      console.error('Error fetching mod packs:', error);
      res.status(500).json({error: 'Error fetching mod packs:', error});
    }
  });
  
  // Upload modpacks
  router.post('/', upload.fields([
    { name: 'modpack', maxCount: 1},
    { name: 'thumbnail', maxCount: 1}
  ]), async (req, res) => {
    const id = Date.now();
    const {name, version, description, modLoader, modName, mcVersion, size} = req.body;
    
    try {
  
      const modpack = req.files['modpack'][0].filename;
      const thumbnail = req.files['thumbnail'][0].filename;
  
      const newModpack = new Modpack({ id, name, description, version, modpack, size, thumbnail, modLoader, modName, mcVersion });
      await newModpack.save();
  
      res.status(201).json({ message: 'Files uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error. Please confirm that all upload fields are provided.' });
    }
  });

  // Edit modpack
  router.put('/:id', upload.fields([
    { name: 'modpack', maxCount: 1},
    { name: 'thumbnail', maxCount: 1}
  ]), async (req, res) => {
    const id = req.params.id;
    
    try {
        
        const selectedModpack = await Modpack.findOne({ id: id});
        if (!selectedModpack) {
            return res.status(404).json({ message: 'Modpack not found' });
        }

        const updatedModpack = {};
        for (const [key, value] of Object.entries(req.body)) {
          updatedModpack[key] = value;
        }
        
        let oldFiles = [];

        if (req.files) {
          if (req.files['modpack'] && req.files['modpack'][0]) {
            updatedModpack.modpack = req.files['modpack'][0].filename;
            oldFiles.push(selectedModpack.modpack);
          }
          if (req.files['thumbnail'] && req.files['thumbnail'][0]) {
            updatedModpack.thumbnail = req.files['thumbnail'][0].filename;
            oldFiles.push(selectedModpack.thumbnail);
          }
        }

        if (updatedModpack.modpack === "" ) {
          oldFiles.push(selectedModpack.modpack);
        }
        if (updatedModpack.thumbnail === "" ) {
          oldFiles.push(selectedModpack.thumbnail);
        }
        
        await Modpack.updateOne({ id: id }, { $set: updatedModpack });

        await deleteFiles(oldFiles, uploadsPath);

        res.status(201).json({ message: 'Modpack updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erroring updating modpack' });
    }

  });
  
  // Download modpack
  router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {

      const selectedModpack =  await Modpack.findOne({ id: id });
      const modpack = selectedModpack.modpack;
      const filePath = path.join(uploadsPath, modpack);
      if (fs.existsSync(filePath)) {
  
        res.setHeader( 'Content-Disposition', `attachment; filename=${modpack}` );
        res.setHeader( 'Content-Type', 'application/octet-stream' );
    
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      } else {
        res.status(404).json({ message: 'File not found' });
      }    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error downloading modpack' });
    }
  
  });
  
  // Delete modpack
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
  
      const packToDelete = await Modpack.findOne({ id: id});

      if (!packToDelete) {
        return res.status(404).json({ message: 'Modpack not found' });
      }

      await Modpack.deleteOne(packToDelete);

      let filesToDelete = [];

      if (packToDelete.modpack !== "" ) {
        filesToDelete.push(packToDelete.modpack);
      }
      if (packToDelete.thumbnail !== "" ) {
        filesToDelete.push(packToDelete.thumbnail);
      }

      await deleteFiles(filesToDelete, uploadsPath);
      
      res.status(200).json({ message: 'Deleted modpack successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting modpack' });
    }
  
  });

  module.exports = router;
  