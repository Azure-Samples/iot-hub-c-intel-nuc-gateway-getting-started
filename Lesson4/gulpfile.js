/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var args = require('get-gulp-args')();
var gulp = require('gulp');

var azureTableReaderClient = require('./azure-table.js');
var iotHubReaderClient = require('./iot-hub.js');

function initTasks(gulp) {
  /**
   * Setup common gulp tasks: init, read
   */
  require('gulp-common')(gulp, 'gateway', {
    appName: 'lesson-4',
    configTemplate: {
      'ssh-config': {
        'device_host_name_or_ip_address': '[device hostname or IP address]',
        'device_user_name': 'root',
        'device_password': 'root',
        'ssh_port': 22
      },
      'sensortag-config': {
        'IoT_hub_name': '[IoT Hub name]',
        'IoT_hub_suffix': 'azure-devices.net',
        'devices': [{
          'iot_device_connection_string': '[IoT device connection string]',
          'BLE_mac_address': '[SensorTag mac address]'
        }]
      },
      'azure-config': {
        'iot_hub_connection_string': '[IoT Hub connection string]',
        'iot_device_connection_string': '[IoT device connection string]',
        'azure_storage_connection_string': '[Azure storage connection string]',
        'iot_hub_consumer_group_name': '$Default'
      }
    },
    configPostfix: 'gateway'
  });

  var config = gulp.config;

  var iotHubReader;
  var tableReader;
  gulp.task('read', false, () => {
    if (args['iot-hub']) {
      iotHubReader = new iotHubReaderClient(config.iot_hub_connection_string);
      iotHubReader.startReadMessage(config.iot_hub_consumer_group_name);
    }

    if (args['table-storage']) {
      tableReader = new azureTableReaderClient(config.azure_storage_connection_string);
      tableReader.startReadMessage('DeviceData');
    }
  })

  // stop the iotHubReader
  gulp.task('stop-read', false, () => {
    if (iotHubReader) {
      iotHubReader.stopReadMessage();
    }

    if (tableReader) {
      tableReader.stopReadMessage();
    }
  });

  // start run-internal task, and stop-read after the run-internal finished
  gulp.task('send-device-to-cloud-messages', false, () => {
    require('run-sequence').use(gulp)('run-internal', 'stop-read');
  });

  // override run task
  gulp.task('run', 'Run the BLE sample application in the Gateway SDK.', ['read', 'send-device-to-cloud-messages'], null, {
    options: {
      'iot-hub': '[OPTIONAL] Read messages from your IoT Hub.',
      'table-storage': '[OPTIONAL] Read messages from your Azure Table storage.'
    }
  });
}

initTasks(gulp);
