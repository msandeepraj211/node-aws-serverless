/**
 * This Plugin is used as an addon to print the logs to console of lambda and also to cloud watch. 
 */
'use strict';
const Console = require('console').Console;
const intercept = require('intercept-stdout');
const colors = require('colors');
const _config = require('./config');

let levelOptions = {
  'log': 1,
  'info': 2,
  'success': 2,
  'debug': 3,
  'warn': 4,
  'error': 5,
  'trace': 6
};
// set theme 
colors.setTheme({
  date: 'grey',
  success: 'green',
  info: 'cyan',
  log: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
  trace: 'red'
});

let formatArguments = function(argsObj) {
  let keys = Object.keys(argsObj);
  return keys.map((key) => {
    return argsObj[key];
  });
};
class Logger extends Console {

  constructor(config) {
    super(process.stdout, process.stderr);

    this.config = Object.assign({}, _config, config);
    this.logLevel = levelOptions[this.config.logLevel];

    intercept((log) => {
      return colors.date(new Date().toLocaleString()) + colors[this.level](' ' + this.level + ': ') + log;
    });
  }
  time(name, levelName) {
    if (levelOptions[levelName] >= this.logLevel) {
      super.time(name);
    }
  }
  timeEnd(name, levelName) {
    if (levelOptions[levelName] >= this.logLevel) {
      this.timeEndLog = true;
      super.timeEnd(name);
    }
  }
  log() {
    if (levelOptions.log >= this.logLevel || this.timeEndLog) {
      this.level = 'log';
      this.timeEndLog = false;
      super.log.apply(this, formatArguments(arguments));
    }
  }
  info() {
    if (levelOptions.info >= this.logLevel) {
      this.level = 'info';
      super.info.apply(this, formatArguments(arguments));
    }
  }
  success() {
    if (levelOptions.success >= this.logLevel) {
      this.level = 'success';
      super.info.apply(this, formatArguments(arguments));
    }
  }
  debug() {
    if (levelOptions.debug >= this.logLevel) {
      this.level = 'debug';
      super.log.apply(this, formatArguments(arguments));
    }
  }
  warn() {
    if (levelOptions.warn >= this.logLevel) {
      this.level = 'warn';
      super.warn.apply(this, formatArguments(arguments));
    }
  }
  error() {
    if (levelOptions.error >= this.logLevel) {
      this.level = 'error';
      super.error.apply(this, formatArguments(arguments));
    }
  }
  trace() {
    if (levelOptions.error >= this.logLevel) {
      this.level = 'trace';
      super.trace.apply(this, formatArguments(arguments));
    }
  }
}

module.exports = Logger;
