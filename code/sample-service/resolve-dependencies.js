/**
 * This file is used to resolve any dependencies 
 */
'use strict';
const config = require('./config');
const dependenciesList = config.dependenciesList;
let dependencies = {};

dependenciesList.map((dependency) => {
  if (config[dependency]) {
    dependencies[dependency] = require(`./_${dependency}`)(config[dependency]);
  }
});
