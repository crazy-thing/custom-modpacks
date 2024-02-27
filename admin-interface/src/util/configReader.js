export const readConfig = async () => {
    try {
        const res = await fetch('/config.json');
        if (!res.ok) {
            throw new Error('Network res was not ok');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error reading config: ', error);
        return null;
    }
}
