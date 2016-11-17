/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var moment = require('moment');
var storage = require('azure-storage');
var blePrinter = require('./ble-message-printer.js');

// Read messages from Azure Table.
var readNewMessages = function (tableName, startTime) {
  // terminate condition: stop once the reading flag is false
  if (!this.reading) {
    return;
  }

  var condition = 'PartitionKey eq ? and RowKey gt ? ';
  // only query messages that're no later than the current time
  var query = new storage.TableQuery().where(condition, moment.utc().format('YYYYMMDD'), startTime);
  this.tableService.queryEntities(tableName, query, null, function(error, result) {
    if (error) {
      if (error.statusCode && error.statusCode == 404) {
        // if 404 error, no more try
        console.error(
          '[Azure Table] ERROR: Table not found. Something might be wrong. Please go to troubleshooting page for more information.')
      } else {
        console.error('[Azure Table] ERROR:\n' + error);
        readNewMessages(tableName, startTime);
      }
      return;
    }

    // result.entries contain entities matching the query
    if (result.entries.length === 0) {
      readNewMessages(tableName, startTime);
      return;
    }
    for (var i = 0; i < result.entries.length; i++) {
      blePrinter('Azure Table', Buffer.from(result.entries[i].message['_'], 'base64'));

      // update startTime so that we don't get old messages
      if (result.entries[i].RowKey['_'] > startTime) {
        startTime = result.entries[i].RowKey['_'];
      }
    }

    readNewMessages(tableName, startTime);
  });
}


// set read flag to true, and run into readNewMessages loop
AzureTableReaderClient.prototype.startReadMessage = function(tableName) {
  this.reading = true;
  var startTime = moment.utc().format('hhmmssSSS');
  readNewMessages(tableName, startTime);
}

// set read flag to false, then the readNewMessages will stop
AzureTableReaderClient.prototype.stopReadMessage = function() {
  this.reading = false;
}

function AzureTableReaderClient(connectionString) {
  this.tableService = storage.createTableService(connectionString);
  readNewMessages = readNewMessages.bind(this);
}

module.exports = AzureTableReaderClient;
