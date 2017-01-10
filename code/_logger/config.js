const env = process.env.ENV || 'delevopment';
const config = {
  common: {
    logLevel: 'log'
  },
  development: {

  },
  production: {
    'logLevel': 'warn'
  }
};

module.exports = Object.assign({}, config.common, config[env]);
