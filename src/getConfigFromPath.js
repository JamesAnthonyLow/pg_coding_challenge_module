import 'isomorphic-fetch';
import fs from 'fs';

function getConfigFromPath(pathObj) {
  const fetchConfig = (urlOrPath) => {
    let res;
    fetch(urlOrPath).then((response) => {
      if (response.ok) {
        return response.blob();
      }
      throw new Error(`Error in network response from ${pathObj.url}`);
    }).then((response) => {
      res = response;
    }).catch((err) => {
      throw new Error(err);
    });
    return res;
  };
  let result;
  if (typeof pathObj.url !== 'undefined') {
    result = fetchConfig(pathObj.url);
  } else if (typeof pathObj.path === 'undefined') {
    throw new Error('Invalid config file');
  } else {
    result = JSON.parse(fs.readFileSync(pathObj.path, 'utf8'));
  }
  return result;
}

export default getConfigFromPath;
