/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var gulp = require('gulp');
var args = require('get-gulp-args')();

function initTasks(gulp) {
  /*
   * Setup common gulp tasks: init, read
   */
  require('gulp-common')(gulp, 'gateway', {
    appName: 'lesson-3',
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
        'iot_hub_consumer_group_name': 'cg1'
      }
    },
    configPostfix: 'gateway'
  });

  var config = gulp.config;

  gulp.task('read', 'Read message from Azure cloud.', () => {
    if(args['iot-hub']) {
      require('./iot-hub.js').readIoTHub(config);
    } else {
      console.error('Usage: gulp read --iot-hub');
    }
  }, {
    options: {
      'iot-hub': 'Read messages from your IoT Hub.',
    }
  })
}

initTasks(gulp);
