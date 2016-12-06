/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var spawn = require('child_process').spawn;
var simulateConfig = require('./lib/simudev-config.js');
var util = require('./lib/util.js');

function run(configPath, timeout) {
  // change directory
  process.chdir(simulateConfig.samplePath);
  // set crt
  // export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
  process.env['SSL_CERT_FILE'] = '/etc/ssl/certs/ca-certificates.crt';
  // run sample
  var ps = spawn('./' + simulateConfig.sampleBinary, [configPath], {
    stdio: ['pipe', 'pipe', process.stderr]
  });

  ps.stdout.on('data', (data) => {
    var message = data.toString().replace(/Press return to exit the application.\s*/g, '');
    message = message.replace(/\r\n/g, '\n');
    message = message.replace(/\n/g, '');
    console.log(message);
  })

  var isTerminate = false;

  function terminate(code) {
    if (!isTerminate) {
      ps.kill(code);
      isTerminate = true;
    }
  }

  setTimeout(() => {
    ps.stdin.write('\r\n');
  }, timeout);

  process.on('SIGINT', terminate);
  process.on('SIGTERM', terminate);
  process.on('exit', terminate);
}

(function(timeout) {
  timeout = timeout || 40000;
  simulateConfig.create({}, (stdout, error) => {
    if(error) {
      util.errorHandler(error);
    } else {
      run(stdout, timeout);
    }
  });
})(process.argv[2]);
