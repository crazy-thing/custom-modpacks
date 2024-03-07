const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    mcVersion: {
        type: String,
        required: true,
    },
    modLoader: {
        type: String,
        required: true,
    },
    modName: {
        type: String,
        required: true,
    },
});

const modpackSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    versions: [versionSchema],
});

const Modpack = mongoose.model('Modpack', modpackSchema);

module.exports = Modpack;