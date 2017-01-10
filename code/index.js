'use strict';
var serviceName = process.env.SERVICE_NAME;
var app = require(`/${serviceName}/index.js`);
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  app.eventHandler(event, context, callback);
};
