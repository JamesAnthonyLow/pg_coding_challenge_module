import Conf from './config';

function getConfigFromPath(pathObj){
  if (typeof pathObj.url !== 'undefined') {
    fetch(pathObj.url, {
      method: 'get'
    }).then((response) => {
      return response;
    }).catch((err) => {
      throw new Error(err);
    });
  } else if (typeof pathObj.path !== 'undefined') {
    return require(`${Conf.root}/${Conf.subscriber.path}`);
  } else {
    throw new Error('Invalid config file');
  }
}

export default getConfigFromPath;
