/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var fs = require('fs');
var spawn = require('child_process').spawn;
var bleConfig = require('./lib/bleconfig.js');
var testConnectivity = require('./lib/test-connectivity.js');
var util = require('./lib/util.js');

function run(configPath, timeout) {
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

  setTimeout(() => {
    ps.kill('SIGTERM');
  }, timeout);

  process.on('SIGINT', terminate);
  process.on('SIGTERM', terminate);
  process.on('exit', terminate);
}

function testDevicesConnectivities(devices, allSuccess, onceFail) {
  var promises = [];
  for (var i = 0; i < devices.length; i++) {
    var mac = devices[i]['BLE_mac_address'];
    promises.push(new Promise((resolve, reject) => {
      console.log('Testing connectivity of ' + mac);
      testConnectivity(mac, (mac) => {
        console.log(mac + ' can be successfully connected');
        resolve(mac);
      }, (mac) => {
        reject(mac + ' cannot be connected now. \r\nPlease make sure you already power on your SensorTag.');
      });
    }));
  }

  Promise.all(promises)
    .then(() => {
      allSuccess();
    })
    .catch(onceFail);
}

(function(timeout) {
  timeout = timeout || 40000;
  // Step1. Preparation
  Promise.all([
    // check binary exists
    new Promise((resolve, reject) => {
      var binaryPath = bleConfig.samplePath + bleConfig.sampleBinary;
      fs.exists(binaryPath, (exists) => {
        if (!exists) {
          reject(binaryPath + ' not found');
        } else {
          resolve();
        }
      });
    }),
    // create config
    new Promise((resolve, reject) => {
      bleConfig.create({}, (stdout, error) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    }),
    // test connectivity
    new Promise((resolve, reject) => {
      var devices = util.readJSONFileSync(bleConfig.configFile).devices;
      if (!devices) {
        reject('No devices provided');
      } else {
        testDevicesConnectivities(devices, resolve, reject);
      }
    })
  ])
  // Step2. run the sample
  .then((results) => {
    var configPath = results[1];
    if (configPath) {
      // wait 2 seconds for all BLE process is already exit
      setTimeout(() => {
        run(configPath, timeout);
      }, 2000)
    }
  })
  .catch(util.errorHandler);
})(process.argv[2]);
