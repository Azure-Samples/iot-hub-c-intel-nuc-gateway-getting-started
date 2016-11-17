/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var fs = require('fs');

function rpad(str, size) {
  str = str + '';
  if (str.length >= size) {
    return str;
  }
  return str + '                                                                                '.slice(0, size - str.length);
}

function errorHandler(err) {
  console.error(err.message || err);
  process.exit();
}

function eachLine(content, callback) {
  var lines = ('' + content).replace(/\r\n/g, '\n').split('\n');
  lines.forEach(callback);
}

function resolveDeviceConnectionString(connectionstring) {
  // HostName=name.azure-devices.net;DeviceId=device;SharedAccessKey=key
  var result = tokenize(connectionstring);
  if (result['HostName'] && result['DeviceId'] && result['SharedAccessKey']) {
    return result;
  } else {
    throw ('Wrong device connectionstring ' + connectionstring);
  }
}

function tokenize(src) {
  var arr = src.split(';');
  var result = {};
  arr.forEach((item) => {
    var marker = item.indexOf('=');
    if (marker <= 0) {
      return;
    }
    result[item.slice(0, marker)] = item.slice(marker + 1, item.length);
  });
  return result;
}

function readJSONFileSync(filename, forceCheck) {
  try {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (err) {
    // once the forceCheck is set to true, it should throw the error
    if (forceCheck) {
      errorHandler(err);
    } else {
      return {};
    }
  }
}

function saveJSONFileSync(obj, filename) {
  try {
    fs.writeFileSync(filename, JSON.stringify(obj, null, 2));
  } catch (error) {
    errorHandler(error);
  }
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = {
  rpad: rpad,
  errorHandler: errorHandler,
  eachLine: eachLine,
  resolveDeviceConnectionString: resolveDeviceConnectionString,
  readJSONFileSync: readJSONFileSync,
  saveJSONFileSync: saveJSONFileSync,
  clone: clone
}
