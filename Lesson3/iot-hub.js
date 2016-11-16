/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var blePrinter = require('./ble-message-printer.js');

// Close connection to IoT Hub.
IoTHubReaderClient.prototype.stopReadMessage = function() {
  this.iotHubClient.close();
}

// Read device-to-cloud messages from IoT Hub.
IoTHubReaderClient.prototype.startReadMessage = function(consumerGroupName) {
  var printError = function(err) {
    console.error(err.message || err);
  };

  this.iotHubClient.open()
    .then(this.iotHubClient.getPartitionIds.bind(this.iotHubClient))
    .then(function(partitionIds) {
      return partitionIds.map(function(partitionId) {
        return this.iotHubClient.createReceiver(consumerGroupName, partitionId, {
          'startAfterTime': Date.now() - 10000
        })
        .then(function(receiver) {
          receiver.on('errorReceived', printError);
          receiver.on('message', (message) => {
            blePrinter('IoT hub', message.body);
          });
        });
      }.bind(this));
    }.bind(this))
    .catch(printError);
}

function IoTHubReaderClient(connectionString) {
  this.iotHubClient = EventHubClient.fromConnectionString(connectionString);
}

module.exports = IoTHubReaderClient;
