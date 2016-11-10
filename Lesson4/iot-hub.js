/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var blePrinter = require('./ble-message-printer.js');
var iotHubClient;

/**
 * Read device-to-cloud messages from IoT Hub.
 * @param {object}  config - config object
 */
var readIoTHub = function(config) {
  // Receive device-to-cloud messages
  var printError = function(err) {
    console.log(err.message);
  };

  // Only receive messages sent to IoT Hub after this point in time
  var startTime = Date.now() - 10000;

  iotHubClient = EventHubClient.fromConnectionString(config.iot_hub_connection_string);
  iotHubClient.open()
    .then(iotHubClient.getPartitionIds.bind(iotHubClient))
    .then(function(partitionIds) {
      return partitionIds.map(function(partitionId) {
        return iotHubClient.createReceiver(config.iot_hub_consumer_group_name, partitionId, {
          'startAfterTime': startTime
        })
        .then(function(receiver) {
          receiver.on('errorReceived', printError);
          receiver.on('message', (message) => {
            blePrinter('IoT hub', message.body)
          });
        });
      });
    })
    .catch(printError);
}

/**
 * Close connection to IoT Hub.
 */
var cleanup = function() {
  iotHubClient.close();
}

module.exports.readIoTHub = readIoTHub;
module.exports.cleanup = cleanup;
