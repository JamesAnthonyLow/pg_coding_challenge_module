const appRoot = require('app-root-path');
const Conf = require(`${appRoot.path}/.tickle.config`);
if (typeof window === 'undefined') {
  Conf.module = module;
} else {
  Conf.module = window;
}
