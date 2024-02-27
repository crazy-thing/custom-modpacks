const Modpack = require('../models/modpack');
const path = require('path');
const fs = require('fs');


const deleteFiles = async (filesToDelete, uploadsPath) => {
    try {
        console.log(filesToDelete, uploadsPath);
        for (const file of filesToDelete) {
            const usageCount = await Modpack.countDocuments({ $or: [{ modpack: file }, { thumbnail: file }] });


            if (usageCount === 0) {
                const filePath = path.join(uploadsPath, file);

                if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                }
            }
            }
    } catch (error) {
        console.error('Error deleting files: ', error);
    }
}

module.exports = { deleteFiles }