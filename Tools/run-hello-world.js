/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var spawn = require('child_process').spawn;

const PATH = 'sample/hello_world/build/';
const BINARY = 'hello_world';
const CONFIG_FILE = 'hello_world.json';

function run(path, binary, configPath, timeout) {
  // change directory
  process.chdir(path);
  // run sample, inherit the stdout/stderr, but pipe the stdin
  var ps = spawn('./' + binary, [configPath], {
    stdio: ['pipe', process.stdout, process.stderr]
  });

  var isTerminate = false;

  function terminate(code) {
    if (!isTerminate) {
      ps.kill(code);
      isTerminate = true;
    }
  }

  // after `timeout` time, the script send a terminate signal to gateway process
  if (timeout) {
    setTimeout(() => {
      isTerminate = true;
      ps.stdin.write('\r\n');
    }, timeout);
  }

  // catch the ctrl+C ctrl+Z to terminate the process
  process.on('SIGINT', terminate);
  process.on('SIGTERM', terminate);
  process.on('exit', terminate);
}

(function(timeout, config) {
  // 1. generate the gateway json
  // no default thing to do in hello_world sample's json, use the source one
  var configPath = CONFIG_FILE;
  // if there is a specific config, use the specific one
  if (config) {
    configPath = process.cwd() + '/' + config;
  }
  // 2. run the sample code
  run(PATH, BINARY, configPath, timeout);
})(process.argv[2], process.argv[3]);
