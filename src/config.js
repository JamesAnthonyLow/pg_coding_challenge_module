const appRoot = require('app-root-path');
const Conf = require(`${appRoot.path}/.tickle.config`);
Conf.root = appRoot.path;
export default Conf;
