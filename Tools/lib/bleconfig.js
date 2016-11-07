/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var path = require('path');
var fs = require('fs');
var util = require('./util.js');

const configFile = 'config.json';
const defaultSampleConfig = '.ble_gateway.json';
const samplePath = '/usr/share/azureiotgatewaysdk/samples/ble_gateway_hl/';
const sampleBinary = 'ble_gateway_hl';
const sampleConfig = 'ble_gateway.json';

function createConfig(options, callback) {
  // set default option
  options = Object.assign({
    isLocal: true,
    forceUpdate: false
  }, options);

  // choose the base file
  var sampleFile = options.forceUpdate ? defaultSampleConfig : path.join(samplePath, sampleConfig);
  var sample = readJSONFileSync(sampleFile);
  var config = readJSONFileSync(configFile);

  if (!sample.modules) {
    callback('', 'No modules found in ' + sampleFile + ', you can run `node deploy.js --force` to reset your ' + sampleConfig);
    return;
  }

  sample.modules.updateModule('IoTHub', (obj) => {
    obj.args.IoTHubName = config.IoT_hub_name;
    obj.args.IoTHubSuffix = config.IoT_hub_suffix;
  });

  // the sensortag can be mutilple parts, and all of them should map in the mapping module
  var sensortag = sample.modules.findModule('SensorTag');
  if (!sensortag) {
    callback('', 'No SensorTag module found in ' + sampleFile + ', you can run `node deploy.js --force` to reset your ' + sampleConfig);
    return;
  }
  sample.modules.removeModules('SensorTag');
  sample.modules.updateModule('mapping', (obj) => {
    obj.args = [];
  });
  for (var i = 0; i < config.devices.length; i++) {
    var device = config.devices[i];
    var connection = util.resolveDeviceConnectionString(device.iot_device_connection_string);
    sample.modules.updateModule('mapping', (obj) => {
      obj.args.push({
        macAddress: device.BLE_mac_address,
        deviceId: connection.DeviceId,
        deviceKey: connection.SharedAccessKey
      });
    });

    var sensortagModule = sensortag.clone();
    sensortagModule.args['controller_index'] = i;
    sensortagModule.args['device_mac_address'] = device.BLE_mac_address;
    if(i > 0) {
      var moduleName = 'SensorTag' + i;
      sensortagModule['module name'] = moduleName;
      sample.links.push({
        'source': moduleName,
        'sink': 'mapping'
      }, {
        'source': moduleName,
        'sink': 'BLE Printer'
      }, {
        'source': 'BLEC2D',
        'sink': moduleName
      });
    }
    sample.modules.addModule(sensortagModule);
  }

  var dstFile = options.isLocal ? sampleConfig : path.join(samplePath, sampleConfig);
  saveJSONFileSync(sample, dstFile);
  callback(path.join(process.cwd(), dstFile));
}

// =========== helper ================
Array.prototype.findModule = function(moduleName) {
  return this.find((item) => {
    return item['module name'] === moduleName;
  });
}

Array.prototype.updateModule = function(moduleName, callback) {
  for (var i = 0; i < this.length; i++) {
    var item = this[i];
    if (item['module name'] === moduleName) {
      if (callback) {
        callback(item);
      }
      return item;
    }
  }
}

Array.prototype.addModule = function(item) {
  this.splice(this.length, 0, item);
}

Array.prototype.removeModules = function(moduleName) {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i]['module name'] === moduleName) {
      this.splice(i, 1);
    }
  }
}

function readJSONFileSync(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    util.errorHandler(err);
    return;
  }
}

function saveJSONFileSync(obj, filename) {
  try {
    fs.writeFileSync(filename, JSON.stringify(obj, null, 4));
  } catch (error) {
    util.errorHandler(error);
  }
}

Object.prototype.clone = function() {
  return JSON.parse(JSON.stringify(this));
}

module.exports = {
  create: createConfig,
  samplePath: samplePath,
  sampleBinary: sampleBinary,
  sampleConfig: sampleConfig
};
