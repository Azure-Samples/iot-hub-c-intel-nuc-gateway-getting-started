/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var args = require('get-gulp-args')();
var gulp = require('gulp');
var fs = require('fs');
var runSequence;

function initTasks(gulp) {
  /**
   * Setup common gulp tasks: init, read
   */
  require('gulp-common')(gulp, 'gateway', {
    appName: 'lesson-5',
    configTemplate: {
      'ssh-config': {
        'device_host_name_or_ip_address': '[device hostname or IP address]',
        'device_user_name': 'root',
        'device_password': 'root',
        'ssh_port': 22
      },
      'sensortag-config': {
        'IoT_hub_name': '[IoT Hub name]',
        'IoT_hub_suffix': 'azure-devices.net',
        'devices': [{
          'iot_device_connection_string': '[IoT device connection string]',
        }]
      },
      'azure-config': {
        'iot_hub_connection_string': '[IoT Hub connection string]',
        'azure_storage_connection_string': '[Azure storage connection string]',
        'iot_hub_consumer_group_name': '$Default'
      }
    },
    configPostfix: 'gateway'
  });

  runSequence = require('run-sequence').use(gulp);

  var config = gulp.config;

  gulp.task('modules', '', function(cb) {
    var operation = false;
    if (args['list']) {
      operation = true;
      runSequence('list-modules');
    }
    if (args['feeds']) {
      operation = true;
      showFeeds();
    }
    if (args['add-feed']) {
      operation = true;
      addFeed(args['add-feed']);
    }
    if (args['rm-feed']) {
      operation = true;
      rmFeed(args['rm-feed']);
    }

    if (!operation) {
      runSequence('help', cb);
    } else {
      cb();
    }
  }, {
    options: {
      'list': 'List all modules under specific folder on your Intel NUC',
      'feeds': 'Show all specific folders on your Intel NUC, --list will list modules under these folders',
      'add-feed <path>': 'Add a folder\'s absolute path to the feeds',
      'rm-feed <path>': 'Remove a folder path from the feeds'
    }
  });

  /* Functions for gateway module config on host machine. All operation is for config.module_feeds */

  // show config.module_feeds
  function showFeeds() {
    config.module_feeds.forEach((item) => {
      console.log(item);
    });
  }

  // add feed and save them into config.json, also, it need to change the global part
  function addFeed(feed) {
    if(!feed || !(feed.indexOf('/') === 0 || feed.indexOf('~') === 0)) {
      console.error('Invalid path provided, should be an absolute path!');
      return;
    }
    var localConfig = readLocalConfig();
    var feeds = localConfig.module_feeds || [];
    if(feeds.indexOf(feed) >= 0) { // this item is already added, no need to add the duplicate one
      return;
    }

    feeds.push(feed);
    localConfig['module_feeds'] = feeds;
    saveLocalConfig(localConfig);
    config = Object.assign(localConfig, config);
    gulp.config = config;
  }

  // remove feed and save them into config.json, also, it need to change the global config
  function rmFeed(feed) {
    var localConfig = readLocalConfig();
    var feeds = localConfig.module_feeds || [];
    var index = feeds.indexOf(feed);
    while(index >= 0) {
      feeds.splice(index, 1);
      localConfig['module_feeds'] = feeds;
      index = feeds.indexOf(feed);
    }
    saveLocalConfig(localConfig);
    config = Object.assign(localConfig, config);
    gulp.config = config;
  }

  var localConfigName = 'config.json';
  function readLocalConfig() {
    if (fs.existsSync(localConfigName)) {
      return JSON.parse(fs.readFileSync(localConfigName, 'utf8'));
    }
    return {};
  }

  function saveLocalConfig(obj) {
    fs.writeFileSync(localConfigName, JSON.stringify(obj, null, 2));
  }
}

initTasks(gulp);
