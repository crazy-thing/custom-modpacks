
const url = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';

export const getVanillaVersions = async () => {
    try {
        const res = await fetch(url);
        const data = await res.json();

        if (!data.versions || !Array.isArray(data.versions)) {
            throw new Error('Invalid versions manifest data');
        }

        const versions = data.versions.map(version => version.id);
        
        const pattern = /^\d+(\.\d+){0,2}$/;
        const filteredVersions = versions.filter(version => pattern.test(version))
        return filteredVersions;        
    } catch (error) {
        console.error('Error fetching vanilla versions: ', error);
        return [];
    }
};