
const ApiServer = 'https://meta.fabricmc.net';
const LoaderUrl = `${ApiServer}/v2/versions/loader`;

export const getFabricLoaders =  async () => {
  const response = await fetch(LoaderUrl);
  const loaders = await response.json();

  const versions = loaders.map(loader => loader.version);

  return versions;
};

