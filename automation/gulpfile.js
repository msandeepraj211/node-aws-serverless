'use strict';
const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const gulpZip = require('gulp-zip');
const gulpUtil = require('gulp-util');
const gulpSequence = require('gulp-sequence');
const gulpAwsLambda = require('gulp-aws-lambda');

const codePath = './../code';
const serviceRegex = new RegExp('^_.*');

let getServiceFiles = function(serviceName) {
  let serviceDependencies= require(`${codePath}/${serviceName}/config.js`).serviceDependencies || [];
  let serviceFiles = [`${codePath}/index.js`,`${codePath}/${serviceName}/**/*`];
  serviceDependencies.map((service)=>{
    serviceFiles.push(`${codePath}/_${service}/**/*`);
  });
  return serviceFiles;
};

let getServicesList = function() {
  return fs.readdirSync(codePath).filter(function(file) {
    return fs.statSync(path.join(codePath, file)).isDirectory() && !serviceRegex.test(file);
  });
};

let getLambdaParams = function(serviceName){
  let lambdaParams = require(`${codePath}/${serviceName}/lambda-params`) || require('./config').lambdaParams;
  if(!lambdaParams.params.FunctionName){
    lambdaParams.params.FunctionName = serviceName;
  }
  return lambdaParams;
};

let services = gulpUtil.env.service === 'all' ? getServicesList() : gulpUtil.env.service.split(',');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('build', function() {
  services.map(function(serviceName) {
    gulp.src(getServiceFiles(serviceName), { base: '.', nodir: true, cwd: path.resolve(__dirname, '../', 'code'), cwdbase: true })
      .pipe(gulpZip(serviceName + '.zip'))
      .pipe(gulp.dest('./../dist'));
  });
});

gulp.upload('deploy',function() {
  services.map(function(serviceName){
    let lambdaParams = getLambdaParams();
    gulp.src(`./../dist/${serviceName}.zip`)
    .pipe(gulpAwsLambda(lambdaParams.awsCredentials, lambdaParams.params));
  });
});

gulp.task('buildAndDeploy', gulpSequence('serviceZip', 'deploy'));
