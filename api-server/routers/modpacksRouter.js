const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Modpack = require('../models/modpack');
const { deleteFiles } = require('../helpers/deleteFiles');


// add way to download zip files based off version and modpack id

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
        res.status(500).json({ error: 'Error fetching mod packs:', error });
    }
});

// Upload modpacks
router.post('/', upload.any([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'versions', maxCount: 100 } 
]), async (req, res) => {
    const id = Date.now();
    const { name, description, versions } = req.body;

    try {
        
        const thumbnail = req.files.find(file => file.fieldname === 'thumbnail').filename;

        console.log(req.files)
        const formattedVersions = versions.map(version => ({
            name: version.name,
            id: version.id,
            zip: version.zip,
            size: version.size,
            mcVersion: version.mcVersion,
            modLoader: version.modLoader,
            modName: version.modName
        }));

        const newModpack = new Modpack({
            id,
            name,
            description,
            versions: formattedVersions,
            thumbnail
        });
        await newModpack.save();

        res.status(201).json({ message: 'Modpack created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error. Please confirm that all upload fields are provided.' });
    }
});

router.put('/:id', upload.any([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'versions', maxCount: 100 } 
]), async (req, res) => {
    const id = req.params.id;

    try {
        const selectedModpack = await Modpack.findOne({ id: id });
        if (!selectedModpack) {
            return res.status(404).json({ message: 'Modpack not found' });
        }

        const updatedModpack = {};

        for (const [key, value] of Object.entries(req.body)) {
                updatedModpack[key] = value;
        }

        if (req.body.versions === 'empty') {
            updatedModpack.versions = [];
        }

        const versionsToDelete = [];
        if (updatedModpack.versions && selectedModpack.versions) {
            for (const selectedVersion of selectedModpack.versions) {
                console.log(selectedVersion.zip);
                const matchedVersion = updatedModpack.versions.find(version => version.zip === selectedVersion.zip);
                if (!matchedVersion) {
                    versionsToDelete.push(selectedVersion.zip);
                }
            }
        }


        if (req.files && req.files.find(file => file.fieldname === 'thumbnail')) {
            updatedModpack.thumbnail = req.files.find(file => file.fieldname === 'thumbnail').filename;
            versionsToDelete.push(selectedModpack.thumbnail);
        }

        await Modpack.updateOne({ id: id }, { $set: updatedModpack });
        await deleteFiles(versionsToDelete, uploadsPath);

        res.status(200).json({ message: 'Modpack updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating modpack' });
    }
});


// Download modpack
router.get('/:modpackId/versions/:versionId', async (req, res) => {
    const modpackId = req.params.modpackId;
    const versionId = req.params.versionId;

    try {
        const selectedModpack = await Modpack.findOne({ id: modpackId });
        if (!selectedModpack) {
            return res.status(404).json({ message: 'Modpack not found' });
        }

        const selectedVersion = selectedModpack.versions.find(version => version.id === versionId);
        if (!selectedVersion) {
            return res.status(404).json({ message: 'Version not found' });
        }

        const versionFlePath = path.join(uploadsPath, selectedVersion.zip);

        console.log(versionFlePath);
        if (fs.existsSync(versionFlePath)) {

            res.setHeader('Content-Disposition', `attachment; filename=${selectedVersion.zip}`);
            res.setHeader('Content-Type', 'application/octet-stream');

            const fileStream = fs.createReadStream(versionFlePath);
            fileStream.pipe(res);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error downloading modpack version' });
    }
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const packToDelete = await Modpack.findOne({ id: id });

        if (!packToDelete) {
            return res.status(404).json({ message: 'Modpack not found' });
        }

        let filesToDelete = [];
        for (const version of packToDelete.versions) {
            if (version.zip) {
                filesToDelete.push(version.zip);
            }
        }

        if (packToDelete.thumbnail !== "") {
            filesToDelete.push(packToDelete.thumbnail);
        }

        await Modpack.deleteOne({ id: id });

        await deleteFiles(filesToDelete, uploadsPath);

        res.status(200).json({ message: 'Deleted modpack successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting modpack' });
    }
});

router.delete('/:modpackId/versions/:versionId', async ( req, res ) => {
    const modpackId = req.params.modpackId;
    const versionId = req.params.versionId;

    try {
        const selectedModpack = await Modpack.findOne({ id: modpackId });
        if (!selectedModpack) {
            return res.status(404).json({ message: 'Modpack not found' });
        }

        const selectedVersion = selectedModpack.versions.find(version => version.id === versionId);
        if (!selectedVersion) {
            return res.status(404).json({ message: 'Version not found' });
        }

        const versionIndex = selectedModpack.versions.findIndex(version => version.id === versionId);
        if (versionIndex === -1) {
            return res.status(404).json({ message: 'Version not found' });
        }
        
        selectedModpack.versions.splice(versionIndex, 1);

        const filesToDelete = [selectedVersion.zip];

        await deleteFiles(filesToDelete, uploadsPath);


        await selectedModpack.save();

        res.status(200).json({ message: 'Version deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting version' });
    }
});


module.exports = router;