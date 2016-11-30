/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var path = require('path');
var util = require('./util.js');
var GatewayConfig = require('./gateway-config.js');

const CONFIG_FILE = 'config.json';
const DEFAULT_SAMPLE_CONFIG = '.simulated_device_cloud_upload.json';
const SAMPLE_PATH = '/usr/share/azureiotgatewaysdk/samples/simulated_device_cloud_upload/';
const SAMPLE_BINARY = 'simulated_device_cloud_upload';
const SAMPLE_CONFIG = 'simulated_device_cloud_upload.json';

function createConfig(options, callback) {
  // set default option
  options = Object.assign({
    isLocal: true,
    forceUpdate: false
  }, options);

  // choose the base file
  var sampleFile = options.forceUpdate ? DEFAULT_SAMPLE_CONFIG : path.join(SAMPLE_PATH, SAMPLE_CONFIG);
  var gatewayConfig = new GatewayConfig(sampleFile);
  var config = util.readJSONFileSync(CONFIG_FILE, true);

  if (!gatewayConfig.getModules) {
    if (options.forceUpdate) {
      callback('', 'No modules found in ' + sampleFile + '.');
    } else {
      createConfig({
        isLocal: options.isLocal,
        forceUpdate: true
      }, callback);
    }
    return;
  }

  gatewayConfig.updateModule('IotHub', (obj) => {
    obj.args.IoTHubName = config.IoT_hub_name;
    obj.args.IoTHubSuffix = config.IoT_hub_suffix;
  });

  // put the log file in each user's profile folder to avoid permission issue
  gatewayConfig.updateModule('Logger', (obj) => {
    obj.args['filename'] = path.join(process.cwd(), 'deviceCloudUploadGatewaylog.log');
  });

  gatewayConfig.updateModule('mapping', (obj) => {
    obj.args = [];
  });

  gatewayConfig.setLink([{
    source: '*',
    sink: 'Logger'
  }, {
    source: 'mapping',
    sink: 'IotHub'
  }]);

  // the ble can be mutilple parts, and all of them should map in the mapping module
  var ble;
  for (var i = 1; i <= 2; i++) {
    var moduleName = 'BLE' + i;
    ble = gatewayConfig.findModule(moduleName);
    if (ble) {
      gatewayConfig.removeModules(moduleName);
    }
  }

  if (!ble) {
    callback('', 'No BLE module found in ' + sampleFile);
    return;
  }

  // add device one by one
  for (i = 0; i < config.devices.length; i++) {
    var device = config.devices[i];
    var connection = util.resolveDeviceConnectionString(device.iot_device_connection_string);
    var macAddress = createMacAddress(i + 1);
    var name = 'BLE' + (i + 1);
    // add the logical device and physical device mapping into mapping module
    gatewayConfig.updateModule('mapping', (obj) => {
      obj.args.push({
        macAddress: macAddress,
        deviceId: connection.DeviceId,
        deviceKey: connection.SharedAccessKey
      });
    });

    // add the physical module for this device, which define the instruction will send to SensorTag
    var bleModule = util.clone(ble);
    bleModule.args.macAddress = macAddress;
    bleModule.name = name;

    gatewayConfig.addModule(bleModule);
    gatewayConfig.addLinks({
      source: name,
      sink: 'mapping'
    });
  }

  var dstFile = options.isLocal ? SAMPLE_CONFIG : path.join(SAMPLE_PATH, SAMPLE_CONFIG);
  gatewayConfig.save(dstFile);
  callback(path.join(process.cwd(), dstFile));
}

// create a mac address as 0i:0i:0i:0i:0i:0i
// parameter i is a decimal number, here should change to hex number
function createMacAddress(i) {
  if (i > 255) {
    throw 'parameter should less than 255, but here get ' + i;
  }
  var hex = i.toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return (hex + ':' + hex + ':' + hex + ':' + hex + ':' + hex + ':' + hex).toUpperCase();
}

module.exports = {
  create: createConfig,
  configFile: CONFIG_FILE,
  samplePath: SAMPLE_PATH,
  sampleBinary: SAMPLE_BINARY,
  sampleConfig: SAMPLE_CONFIG
};
