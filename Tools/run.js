/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var bleConfig = require('./lib/bleconfig.js');
var util = require('./lib/util.js');

function run(configPath) {
  // change directory
  process.chdir(bleConfig.samplePath);
  // set crt
  // export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
  process.env['SSL_CERT_FILE'] = '/etc/ssl/certs/ca-certificates.crt';
  // run sample
  var ps = spawn('./' + bleConfig.sampleBinary, [configPath], {
    stdio: 'inherit'
  });
  // re-direct the Ctrl-C and SIGTERM to this process
  // reference:
  // https://github.com/Azure/azure-iot-gateway-sdk/blob/36ae38cd115e7ee441e40864b61a29a9ddc78d3c/samples/ble_gateway_hl/src/main.c#L188
  var isTerminate = false;

  function terminate(code) {
    if (!isTerminate) {
      ps.kill(code);
      isTerminate = true;
    }
  }
  process.on('SIGINT', terminate);
  process.on('SIGTERM', terminate);
  process.on('exit', terminate);
}

(function() {
  // Step1. check if binary exists
  new Promise((resolve, reject) => {
    var binaryPath = bleConfig.samplePath + bleConfig.sampleBinary;
    fs.exists(binaryPath, (exists) => {
      if (!exists) {
        reject(binaryPath + ' not found');
      } else {
        resolve();
      }
    });
  })
  // Step2. deploy the device
  .then(() => {
    return new Promise((resolve, reject) => {
      bleConfig.create({}, (stdout, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      })
    });
  })
  // Step3. run the sample
  .then(run).catch(util.errorHandler);
})();
