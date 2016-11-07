/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

// This function is triggered each time a message is revieved in the IoTHub.
// The message payload is persisted in an Azure Storage Table
var moment = require('moment');

module.exports = function (context, iotHubMessage) {
  context.log('Message received: ', iotHubMessage);
  context.bindings.outputTable = {
    "partitionKey": moment.utc().format('YYYYMMDD'),
    "rowKey": moment.utc().format('hhmmss') + process.hrtime()[1] + '',
    "message": iotHubMessage
  };
  context.done();
};
