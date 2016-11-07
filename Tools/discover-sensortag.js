/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var bluetoothctl = require('./lib/bluetoothctl.js');
var util = require('./lib/util.js');

function filter(line) {
  function resolveDeviceName(line) {
    var reg = /^Device[ ](([0-9A-Fa-f]{2}\:){5}[0-9A-Fa-f]{2})[ ]([^\:]+)$/gm;
    var match = reg.exec(line);
    if (match) {
      return {
        mac: match[1],
        name: match[3]
      };
    }
  }

  function resolveDeviceInfo(content) {
    var device = {};
    util.eachLine(content, (line) => {
      var deviceReg = /^Device[ ](([0-9A-Fa-f]{2}\:){5}[0-9A-Fa-f]{2})$/gm;
      var infoReg = /^\s+(.+)?:[ ](.+)$/gm;
      var match = infoReg.exec(line);
      if (match) {
        device[match[1]] = device[match[1]] || match[2];
        return;
      }
      match = deviceReg.exec(line);
      if (match) {
        device['Mac'] = match[1];
        return;
      }
    });
    return device;
  }

  function isSensorTagBLE(device) {
    // alias should case sensetive equal to CC2650 SensorTag, and ManufacturerData Key should be 0x0d
    return device['Alias'] && device['Alias'].indexOf('SensorTag') >= 0
      && device['ManufacturerData Key'] && /^0x[0]*d$/.test(device['ManufacturerData Key'].toLowerCase())
      && device['UUID'] && device['UUID'].indexOf('0000-1000-8000-00805f9b34fb') >= 0;
  }

  var deviceName = resolveDeviceName(line);
  if (deviceName) {
    bluetoothctl.info(deviceName.mac, (deviceInfo, err) => {
      if (err) {
        util.errorHandler(err);
        return;
      }
      var device = resolveDeviceInfo(deviceInfo);
      if (isSensorTagBLE(device)) {
        show(device);
      }
    });
  }
}

function show(device) {
  console.log(
    util.rpad(device['Mac'], 24),
    util.rpad(device['Name'], 24),
    util.rpad(device['Connected'], 16),
    util.rpad(device['Paired'], 12)
  );
}

function getDevices() {
  bluetoothctl.devices((devices, err) => {
    if (err) {
      util.errorHandler(err);
      return;
    }

    // show title line
    // add all information into the title part, let show() to choose which to show up.
    show({
      'Mac': 'Mac Address',
      'Name': 'Device Name',
      'Alias': 'Device Alias',
      'Blocked': 'Blocked',
      'Connected': 'Connected',
      'LegacyPairing': 'LegacyPairing',
      'UUID': 'UUID',
      'Paired': 'Paired',
      'Trusted': 'Trusted',
      'ManufacturerData Key': 'ManufacturerData Key',
      'ManufacturerData Value': 'ManufacturerData Value'
    });
    util.eachLine(devices, filter);
  });
}

function scanPromiseCreator(timeout) {
  return new Promise((resolve, reject) => {
    bluetoothctl.scan(timeout, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    })
  });
}

(function(timeout) {
  timeout = timeout || 5000;
  // Step1. init the bluetoothctl environment
  new Promise((resolve, reject) => {
    bluetoothctl.init((stdout, error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  })
  // Step2. Scan 5 seconds to look for BLE devices
  .then(() => {
    return scanPromiseCreator(1000);
  }).then(() => {
    return scanPromiseCreator(timeout);
  })
  // Step3. Get BLE devices information and show it out
  .then(() => {
    setTimeout(function() {
      getDevices();
    }, 1000);
  })
  .catch(util.errorHandler);
})(process.argv[2]);
