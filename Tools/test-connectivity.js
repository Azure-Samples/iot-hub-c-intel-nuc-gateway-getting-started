/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var bluetoothctl = require('./lib/bluetoothctl.js');
var util = require('./lib/util.js');

(function(mac) {
  // the bluetootchctl can only support upper case
  mac = (mac + '').toUpperCase();
  // check whether the mac address is the correct one
  if (!valid(mac)) {
    usage();
    return;
  }

  // Step1. init the bluetoothctl
  var initPromise = new Promise((resolve, reject) => {
    bluetoothctl.init((stdout, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  // Step2. try to connect the device
  initPromise.catch(util.errorHandler);
  var connectPromise = initPromise.then(() => {
    return new Promise((resolve, reject) => {
      connect(mac, util.errorHandler, (isConnected) => {
        if (isConnected) {
          resolve(mac);
        } else {
          reject(mac);
        }
      });
    });
  });

  // if success, exit
  connectPromise.then(connectSuccess).then(() => {
    process.exit();
  });

  // if failed, scan 3 seconds and retry.
  connectPromise.catch(() => {
    return new Promise((resolve, reject) => {
      bluetoothctl.scan(3000, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  })
  .then(() => {
    connect(mac, util.errorHandler, (isConnected) => {
      if (isConnected) {
        connectSuccess(mac);
      } else {
        connectFail(mac);
      }
    })
  })
  .catch(util.errorHandler)
})(process.argv[2]);

function connectFail(mac) {
  console.log(mac + ' cannot be connected now.');
}

function connectSuccess(mac) {
  console.log(mac + ' can be successfully connected.');
}

function connect(mac, errorCallback, callback) {
  function isConnected(message) {
    return message.indexOf('Connection successful') >= 0;
  }

  bluetoothctl.connect(mac, (stdout, error) => {
    if (error) {
      errorCallback(error);
    } else if (isConnected(stdout)) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

function valid(mac) {
  return /^([0-9A-Fa-f]{2}\:){5}[0-9A-Fa-f]{2}$/.test(mac);
}

function usage() {
  console.log('usage: node testconnect.js <mac address>')
}
