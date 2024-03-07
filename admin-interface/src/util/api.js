const createFormData = (modpack) => {
    const formData = new FormData();

    formData.append('name', modpack.name);
    formData.append('version', modpack.version);
    formData.append('description', modpack.description);
    formData.append('thumbnail', modpack.thumbnail); // Append the file with a name
    modpack.versions.forEach((version, index) => {
        console.log(version);
        formData.append(`versions[${index}][name]`, version.name);
        formData.append(`versions[${index}][id]`, version.id);
        formData.append(`versions[${index}][zip]`, version.zip); // Append the file with a name
        formData.append(`versions[${index}][zipFile]`, version.zipFile);
        formData.append(`versions[${index}][size]`, version.size);
        formData.append(`versions[${index}][mcVersion]`, version.mcVersion);
        formData.append(`versions[${index}][modLoader]`, version.modLoader);
        formData.append(`versions[${index}][modName]`, version.modName);
    });

    return formData;
};

export const uploadModpack = async (modpack, baseUrl) => {
    try {
        const formData = createFormData(modpack);

        const res = await fetch(baseUrl, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload file');
        }

        return res.json();
    } catch (error) {
        console.error('Error uploading file: ', error);
        throw error;
    }
};

export const editModpack = async (modpack, baseUrl) => {
    try {
        const formData = createFormData(modpack);

        const res = await fetch(`${baseUrl}/${modpack.id}`, {
            method: 'PUT',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed updating file');
        }

        return res.json();
    } catch (error) {
        console.error('Error updating file: ', error);
        throw error;
    }
};

export const getAllModpacks = async (baseUrl) => {
    try {
        const res = await fetch(baseUrl, {
            method: 'GET',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch modpacks');
        }

        return res.json();
    } catch (error) {
        console.error('Error fetching modpacks: ', error);
        throw error;
    }
};

export const deleteModpack = async (modpack, baseUrl) => {
    try {
        const res = await fetch(`${baseUrl}/${modpack.id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            throw new Error(`Failed to delete modpack with ID: ${modpack.id}`);
        }

        return res.json();
    } catch (error) {
        console.error('Error deleting modpack: ', error);
        throw error;
    }
};
