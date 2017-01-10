'use strict';
const env = process.env.ENV || 'delevopment';
const config = {
  common: {

  },
  development: {

  },
  production: {

  }
};

module.exports = Object.assign({}, config.common, config[env]);
