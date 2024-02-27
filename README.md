# Custom Modpacks
[![Download](https://img.shields.io/badge/Download-Here-A62045?style=for-the-badge)](https://github.com/crazy-thing/custom-modpacks/releases/download/v1.0.0-alpha/Custom.Modpacks.zip) [![License](https://img.shields.io/badge/License-MIT-DB50DF?style=for-the-badge)](https://github.com/crazy-thing/custom-modpacks/blob/main/LICENSE) [![Release](https://img.shields.io/badge/Release-v.1.0.0--aplha-A126FA?style=for-the-badge)](https://github.com/crazy-thing/custom-modpacks/releases/tag/v1.0.0-alpha)

This project serves as a custom API/Web server to host and distribute your Minecraft Modpacks. Ideally, this will be paired with a custom Minecraft launcher to allow for downloads and updates. The admin interface GUI makes it easy to create and manage modpacks on the server side.

# Features
- API server to allow for mod pack upload and distribution
- Admin interface GUI to easily upload and manage mod packs

# Instructions
On the server's first launch you will be prompted to enter the following information:
  - Port Number (3001)
  - New API Endpoint (/example/v1)
  - Existing Database Address (mongodb://127.0.0.1:27017/modpacks)

If you do not have an existing MongoDB address you can enter the example above and you will then be prompted to install MongoDB.
  NOTE: The default port for MongoDB is 27017 
