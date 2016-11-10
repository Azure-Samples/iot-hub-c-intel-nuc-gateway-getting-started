/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var gulp = require('gulp');
var args = require('get-gulp-args')();

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

  gulp.task('read', 'Read message from Azure cloud.', () => {
    var isRead = false; 
    if(args['iot-hub']) {
      isRead = true;
      require('./iot-hub.js').readIoTHub(config);
    }
    if (args['table-storage']) {
      isRead = true;
      require('./azure-table.js').readAzureTable(config);
    }

    if(!isRead) {
      console.error('gulp read --iot-hub OR gulp read --table-storage');
    }
  }, {
    options: {
      'iot-hub': 'Read messages from your IoT Hub.',
      'table-storage': 'Read messages from your Azure Table storage.'
    }
  })
}

initTasks(gulp);
