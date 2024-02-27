const readline = require('readline');
const fs = require('fs');
const path = require('path');


const configFilePath = path.join(process.cwd(), 'config.json'); // change from config.json to ./build/config.json for production

const checkConfigFile = (callback) => {
    if (fs.existsSync(configFilePath)) {
        fs.readFile(configFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading config file:', err);
                callback();
                return;
            }
            try {
                const config = JSON.parse(data);
                if (!config.port || !config.apiUrl || !config.dbAddr) {
                    console.log('Config values are missing. Please provide the required settings.');
                    promptForConfigSettings((newConfig) => {
                        writeConfigToFile(newConfig, () => {
                            callback(); 
                        });
                    }, callback); 
                } else {
                    console.log("Config values found in file:", configFilePath);
                    callback();
                }
            } catch (parseError) {
                console.error('Error parsing config file:', parseError);
                callback();
            }
        });
    } else {
        console.log('Config file not found. Please provide the required settings.');
        promptForConfigSettings((config) => {
            writeConfigToFile(config, () => {
                callback(); 
            });
        }, callback); 
    }
}

const promptForConfigSettings = (callback, mainCallback) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Set Port Number: ', (port) => {
        rl.question('Set API URL e.g. ("/example/v1") : ', (apiUrl) => {
            rl.question('Set MongoDB Address e.g. ("mongodb://127.0.0.1:27017/modpacks") : ', (dbAddr) => {
                rl.close();
                callback({ port, apiUrl, dbAddr }, mainCallback);
            });
        });
    });
}

const writeConfigToFile = (config, callback) => {
    fs.writeFile(configFilePath, JSON.stringify(config, null, 4), (err) => {
        if (err) {
            console.error('Error writing config file: ', err);
        } else {
            console.log('Config file created successfully.');
        }
        callback();
    });
}

const readConfigFile = (callback) => {
    fs.readFile(configFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading config file: ', err);
            callback(err, null);
            return;
        }

        try {
            const config = JSON.parse(data);
            callback(null, config);
        } catch (parseError) {
            console.error('Error parsing config file: ', parseError);
            callback(parseError, null);
        }
    });
};

module.exports = {
    checkConfigFile,
    promptForConfigSettings,
    writeConfigToFile,
    readConfigFile,
};
