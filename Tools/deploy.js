/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var util = require('./lib/util.js');

function usage() {
  console.log('usage: node deploy.js [option]');
  console.log('option:');
  console.log(util.rpad('', 4), util.rpad('--sample=[ble/simulate]'), 'specific the sample type');
  console.log(util.rpad('', 4), util.rpad('-g, --global', 16), 'update config in your sample path rather than ' + process.cwd());
  console.log(util.rpad('', 4), util.rpad('-f, --force', 16), 'force reset the ble_gateway.json to default value');
}

function parseArgv(argvs) {
  var options = {};
  argvs.forEach((argv) => {
    argv = (argv + '').toLowerCase().trim();

    if (argv === '-g' || argv === '--global') {
      options['isLocal'] = false;
    } else if (argv === '-f' || argv === '--force') {
      options['forceUpdate'] = true;
    } else if (argv.startsWith('--sample=')) {
      var type = argv.slice('--sample='.length);
      if (type === 'ble' || type === 'simulate') {
        options['type'] = type;
      } else {
        throw ('Unknown sample type ' + type);
      }
    } else {
      throw ('Unknown argument ' + argv);
    }
  });
  return options;
}

(function(argvs) {
  var options = {};
  try {
    options = parseArgv(argvs);
  } catch (err) {
    usage();
    return;
  }

  var config;
  if (options.type === 'ble') {
    config = require('./lib/ble-config.js');
  } else if(options.type === 'simulate') {
    config = require('./lib/simulate-config.js');
  } else {
    console.error('Missing sample type');
    usage();
    return;
  }

  config.create(options, (stdout, error) => {
    if (error) {
      util.errorHandler(error);
      return;
    }

    console.log(stdout + ' successfully created. To run the sample, use following command:');
    console.log('"cd ' + config.samplePath + '; export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt; ./'
      + config.sampleBinary + ' ' + stdout + '"');
  });
})(process.argv.slice(2));
