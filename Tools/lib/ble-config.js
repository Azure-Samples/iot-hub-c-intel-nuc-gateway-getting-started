/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var path = require('path');
var util = require('./util.js');
var GatewayConfig = require('./gateway-config.js');

const CONFIG_FILE = 'config.json';
const DEFAULT_SAMPLE_CONFIG = '.ble_gateway.json';
const SAMPLE_PATH = '/usr/share/azureiotgatewaysdk/samples/ble_gateway/';
const SAMPLE_BINARY = 'ble_gateway';
const SAMPLE_CONFIG = 'ble_gateway.json';

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

  gatewayConfig.updateModule('IoTHub', (obj) => {
    obj.args.IoTHubName = config.IoT_hub_name;
    obj.args.IoTHubSuffix = config.IoT_hub_suffix;
  });

  // put the log file in each user's profile folder to avoid permission issue
  gatewayConfig.updateModule('Logger', (obj) => {
    obj.args['filename'] = path.join(process.cwd(), 'log-file.log');
  });

  gatewayConfig.updateModule('mapping', (obj) => {
    obj.args = [];
  });

  // the sensortag can be mutilple parts, and all of them should map in the mapping module
  var sensortag = gatewayConfig.findModule('SensorTag');
  if (!sensortag) {
    callback('', 'No SensorTag module found in ' + sampleFile);
    return;
  }

  // update the instruction's read_periodic
  sensortag.args.instructions = [
    {
      type: 'write_at_init',
      'characteristic_uuid': 'F000AA02-0451-4000-B000-000000000000',
      data: 'AQ=='
    },
    {
      type: 'read_periodic',
      'characteristic_uuid': 'F000AA01-0451-4000-B000-000000000000',
      'interval_in_ms': 2000
    },
    {
      type: 'write_at_exit',
      'characteristic_uuid': 'F000AA02-0451-4000-B000-000000000000',
      data: 'AA=='
    }
  ];

  gatewayConfig.removeModules('SensorTag');

  // add device one by one
  for (var i = 0; i < config.devices.length; i++) {
    var device = config.devices[i];
    var connection = util.resolveDeviceConnectionString(device.iot_device_connection_string);
    // add the logical device and physical device mapping into mapping module
    gatewayConfig.updateModule('mapping', (obj) => {
      obj.args.push({
        macAddress: device.BLE_mac_address,
        deviceId: connection.DeviceId,
        deviceKey: connection.SharedAccessKey
      });
    });

    // add the physical module for this device, which define the instruction will send to SensorTag
    var sensortagModule = util.clone(sensortag);
    // ensure the mac address is in upper case
    sensortagModule.args['device_mac_address'] = (device.BLE_mac_address + '').toUpperCase();
    if (i > 0) {
      // if there are more than one sensortags, it should have a unique name and add the link mapping
      var moduleName = 'SensorTag' + i;
      sensortagModule['name'] = moduleName;
      gatewayConfig.addLinks([{
        'source': moduleName,
        'sink': 'mapping'
      }, {
        'source': moduleName,
        'sink': 'BLE Printer'
      }, {
        'source': 'BLEC2D',
        'sink': moduleName
      }]);
    }
    gatewayConfig.addModule(sensortagModule);
  }

  var dstFile = options.isLocal ? SAMPLE_CONFIG : path.join(SAMPLE_PATH, SAMPLE_CONFIG);
  gatewayConfig.save(dstFile);
  callback(path.join(process.cwd(), dstFile));
}

module.exports = {
  create: createConfig,
  configFile: CONFIG_FILE,
  samplePath: SAMPLE_PATH,
  sampleBinary: SAMPLE_BINARY,
  sampleConfig: SAMPLE_CONFIG
};
