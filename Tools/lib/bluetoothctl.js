/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var exec = require('child_process').exec;
var interactcli = require('./interactcli.js');
var cli = new interactcli('bluetoothctl');
const bluetoothctlMiniCompatibleVerion = 5.37;

function init(callback) {
  exec('rfkill unblock bluetooth', (error, stdout, stderr) => {
    if (error || stderr) {
      callback(stdout, error || stderr);
      return;
    }
  });
  exec('bluetoothctl --version', (error, stdout, stderr) => {
    if (error || stderr) {
      callback(stdout, error || stderr);
      return;
    } else if (parseFloat(stdout) < bluetoothctlMiniCompatibleVerion) {
      callback(stdout, 'bluetoothctl version should be greater than ' + bluetoothctlMiniCompatibleVerion + ', current version is ' + stdout);
      return;
    } else {
      callback(stdout);
    }
  });
}

// turn on the scan and scan the BLE devices
function scanDevice(timeout, callback) {
  cli.run([{
    operation: 'power on'
  }, {
    operation: 'scan on'
  }, {
    operation: 'scan off',
    timeout: timeout
  }, {
    operation: 'exit',
    timeout: 500
  }], (stdout, stderr) => {
    callback(stderr)
  });
}

function getDevices(callback) {
  cli.run([{
    operation: 'devices'
  }, {
    operation: 'exit',
    timeout: 500
  }], callback);
}

function infoDevice(mac, callback) {
  cli.run([{
    operation: 'info ' + mac
  }, {
    operation: 'exit',
    timeout: 500
  }], callback);
}

function connectDevice(mac, callback) {
  cli.run([{
    operation: 'power on'
  }, {
    operation: 'connect ' + mac
  }, {
    operation: 'disconnect ' + mac,
    timeout: 1500
  }, {
    operation: 'exit',
    timeout: 500
  }], callback);
}

module.exports = {
  init: init,
  scan: scanDevice,
  devices: getDevices,
  info: infoDevice,
  connect: connectDevice
};
