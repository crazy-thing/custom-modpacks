const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const modPackRouter = require('./routers/modpacksRouter');
const { checkConfigFile, readConfigFile } = require('./helpers/configSetup');
const { promptForMongoDBInstall } = require('./helpers/installMongoDB');

checkConfigFile(() => {
    readConfigFile(async (err, config) => {
        if (err) {
            console.error('Error reading config file: ', err);
            return;
        }

        const app = express();
        const PORT = parseInt(config.port);

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cors());
        app.use(config.apiUrl, modPackRouter);
        app.use('/uploads', express.static('uploads'));
        app.use('/config', express.static('./config.json')); // change from config.json to ./build/config.json for production

        await connectToDatabase(config, () => {
            app.use(express.static('build'));

            app.get('*', (req, res) => {
                res.sendFile('build', 'index.html');
            });
    
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        });

    });
});

const connectToDatabase = async (config, callback) => {
    try {
        console.log("Attempting to connect to MongoDB. This may take a minute...")
        await mongoose.connect(config.dbAddr, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');
        callback();
    } catch (error) {
        await promptForMongoDBInstall(connectToDatabase, config, callback);
    }
}

