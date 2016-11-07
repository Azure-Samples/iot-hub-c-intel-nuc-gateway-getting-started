/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var spawn = require('child_process').spawn;

IneractCli.prototype.run = function run(cmds, callback) {
  var ps = spawn(this.name),
    result = '',
    err = '';

  cmds = cmds || [{
    operation: 'exit',
    timeout: 500
  }];
  var promise = new Promise((resolve/*, reject */) => {
    resolve();
  });
  cmds.forEach((cmd) => {
    promise = promise.then(() => {
      return new Promise((resolve/*, reject*/) => {
        setTimeout(() => {
          ps.stdin.write(cmd.operation + '\n');
          resolve();
        }, cmd.timeout || 0);
      });
    });
  });
  promise.then(() => {});

  // get all stdout and stderr output
  ps.stdout.on('data', (data) => {
    result += data;
  });
  ps.stderr.on('data', (data) => {
    err += data;
  });

  ps.on('error', (error) => {
    if (!callback) {
      return;
    }
    callback(result, error);
  });
  // callback when finish child process
  ps.on('close', (/*code*/) => {
    if (!callback) {
      return;
    }
    if (err === '') {
      callback(result);
    } else {
      callback(result, err);
    }
  });
}

function IneractCli(name) {
  this.name = name;
}

module.exports = IneractCli;
