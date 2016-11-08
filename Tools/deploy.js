/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var util = require('./lib/util.js');
var bleConfig = require('./lib/bleconfig.js');

function usage() {
  console.log('usage: node deploy.js [option]');
  console.log('option:');
  console.log(util.rpad('', 4), util.rpad('-g, --global', 16), 'update ' + bleConfig.samplePath + bleConfig.sampleConfig);
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

  bleConfig.create(options, (stdout, error) => {
    if (error) {
      util.errorHandler(error);
      return;
    }

    console.log('ble_gateway_hl successfully created. To run the sample, use following command:');
    console.log('"cd ' + bleConfig.samplePath + '; export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt; ./'
      + bleConfig.sampleBinary + ' ' + stdout + '"');
  });
})(process.argv.slice(2));
