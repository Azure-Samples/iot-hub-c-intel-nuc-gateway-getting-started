/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var testConnectivity = require('./lib/test-connectivity.js');
var util = require('./lib/util.js');

(function(mac) {
  try {
    testConnectivity(mac, connectSuccess, connectFail);
  } catch (err) {
    var errorMessage = err.message || err;
    if (errorMessage.startsWith('Invalid mac address')) {
      usage();
    } else {
      util.errorHandler(err);
    }
  }
})(process.argv[2]);

function connectFail(mac) {
  console.log(mac + ' cannot be connected now.');
}

function connectSuccess(mac) {
  console.log(mac + ' can be successfully connected.');
  process.exit();
}

function usage() {
  console.log('usage: node testconnect.js <mac address>')
}
