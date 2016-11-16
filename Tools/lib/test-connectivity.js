/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var bluetoothctl = require('./bluetoothctl.js');
var util = require('./util.js');

module.exports = function(mac, connectSuccess, connectFail) {
  // the bluetootchctl only supports upper case
  mac = (mac + '').toUpperCase();
  // check whether the mac address is correct
  if (!valid(mac)) {
    throw ('Invalid mac address ' + mac);
  }

  // Step1. init bluetoothctl
  var initPromise = new Promise((resolve, reject) => {
    bluetoothctl.init((stdout, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });

  // Step2. try connect to the device
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

  // if succeed, exit
  connectPromise.then((mac) => {
    connectSuccess(mac);
    return null;
  });

  // if fail, scan for another 3 seconds and retry.
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
