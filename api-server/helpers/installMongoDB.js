const { exec } = require('child_process');
const { join } = require('path')
const { promisify } = require('util')
const fs = require('fs');
const https = require('https');
const execAsync = promisify(exec);
const readline = require('readline');


const downloadFile = (url, destPath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, res => {
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve(destPath));
            });
        }).on('error', error => {
            fs.unlink(destPath, () => reject(error));
        });
    });
} 

const installMongoDB = async () => {
    try {
        const baseDir = process.cwd();
        const mongodbInstallerUrl = "https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.5-signed.msi";
        const mongodbInstallerPath = join(baseDir, 'mongodb-installer.msi');

        console.log("Installing MongoDB. This will take a few minutes...")
        await downloadFile(mongodbInstallerUrl, mongodbInstallerPath);

        await execAsync(`powershell Start-Process -FilePath msiexec -ArgumentList '/qb /i "${mongodbInstallerPath}" SHOULD_INSTALL_COMPASS="0" ADDLOCAL="ServerService" /quiet /l*v "${baseDir}\\install-log.txt"' -Verb RunAs -Wait`);

        console.log('MongoDB has been installed successfully');
    } catch (error) {
        console.error('Error installing MongoDB: ', error);
    }
}


const promptForMongoDBInstall = async (connectToDatabase, config, callback) => {
    try {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('MongoDB address can not be found. Do you want to install MongoDB locally? (Y/N): ', async (answer) => {
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                await installMongoDB();

                await connectToDatabase(config, callback);
            } else {
                console.log('MongoDB will not be installed.');
            }
            rl.close();
        });
    } catch (error) {
        console.error('Error prompting for MongoDB install: ', error);
    }
}

module.exports = {
    promptForMongoDBInstall,
}
