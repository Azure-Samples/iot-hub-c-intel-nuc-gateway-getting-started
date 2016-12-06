/*
 * IoT Gateway BLE Script - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
 */
'use strict';

var util = require('./util.js');

// load the raw config
function GatewayConfig(configFile) {
  this.config = util.readJSONFileSync(configFile);
}

GatewayConfig.prototype.getModules = function() {
  return this.config.modules;
}

GatewayConfig.prototype.updateModule = function(name, callback) {
  var modules = this.getModules();
  for (var i = 0; i < modules.length; i++) {
    var item = modules[i];
    if (item['name'] === name) {
      if (callback) {
        callback(item);
      }
      return item;
    }
  }
}

GatewayConfig.prototype.findModule = function(name) {
  return this.updateModule(name);
}

GatewayConfig.prototype.addModule = function(item) {
  var modules = this.getModules();
  modules.splice(modules.length, 0, item);
}

GatewayConfig.prototype.removeModules = function(name) {
  var modules = this.getModules();
  for (var i = modules.length - 1; i >= 0; i--) {
    if (modules[i]['name'] === name) {
      modules.splice(i, 1);
    }
  }
}

GatewayConfig.prototype.addLinks = function (links) {
  this.config.links = this.config.links.concat(links);
}

GatewayConfig.prototype.setLink = function(links) {
  this.config.links = links;
}

GatewayConfig.prototype.save = function(filename) {
  util.saveJSONFileSync(this.config, filename);
}

module.exports = GatewayConfig;
