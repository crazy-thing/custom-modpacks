const mongoose = require('mongoose');

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
    version: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    modpack: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        required: false,
    },
    mcVersion: {
        type: String,
        required: true,
    },
    fabricVersion: {
        type: String,
        required: true,
    },
});

const Modpack = mongoose.model('Modpack', modpackSchema);

module.exports = Modpack;