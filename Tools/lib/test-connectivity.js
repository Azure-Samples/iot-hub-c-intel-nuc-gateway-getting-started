/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var bluetoothctl = require('./bluetoothctl.js');
var util = require('./util.js');

// try to connect a device
// if succeed
// then
//   return
// else
//   scan
//   connect again
//   return
// done
module.exports = function(mac, onSucceed, onFailed) {
  // the bluetootchctl only supports upper case
  mac = (mac + '').toUpperCase();
  // check whether the mac address is correct
  if (!valid(mac)) {
    throw ('Invalid mac address ' + mac);
  }

  // Step1. init bluetoothctl
  var promise = new Promise((resolve, reject) => {
    bluetoothctl.init((stdout, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      connect(mac, onSucceed, resolve);
    });
  })
  .then(() => {
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
    connect(mac, onSucceed, onFailed);
  })
  .catch(util.errorHandler);
}

function connect(mac, onSucceed, onFailed) {
  function isConnected(message) {
    return message.indexOf('Connection successful') >= 0;
  }

  bluetoothctl.connect(mac, (stdout, error) => {
    if (error || !isConnected(stdout)) {
      onFailed(mac);
    } else {
      onSucceed(mac);
    }
  });
}

function valid(mac) {
  return /^([0-9A-Fa-f]{2}\:){5}[0-9A-Fa-f]{2}$/.test(mac);
}
