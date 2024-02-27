const createFormData = (modpack) => {
    const formData = new FormData();

    formData.append('name', modpack.name);
    formData.append('version', modpack.version);
    formData.append('description', modpack.description);
    formData.append('mcVersion', modpack.mcVersion);
    formData.append('fabricVersion', modpack.fabricVersion);
    formData.append('modpack', modpack.modpack);
    formData.append('thumbnail', modpack.thumbnail);
    formData.append('size', modpack.size);

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
