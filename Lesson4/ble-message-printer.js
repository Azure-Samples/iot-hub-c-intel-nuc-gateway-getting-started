var moment = require('moment');

function getTemperature(ldata, hdata) {
  /* <reference path="http://processors.wiki.ti.com/index.php/CC2650_SensorTag_User's_Guide#Data" /> */
  return ((hdata * 256 + ldata) / 4 * 0.03125).toFixed(6);
}

module.exports = function(from, buffer) {
  var message = buffer.toString();
  /* the temperature data's size should exactly equal to 4 and the toString should not equal to NA
     <reference path="https://github.com/Azure/azure-iot-gateway-sdk/blob/a16fee5/samples/ble_gateway_hl/ble_printer/src/ble_printer.c#L41" /> */
  if (buffer.length === 4 && message !== 'N.A.') {
    message = 'Temperature (' + getTemperature(buffer[0], buffer[1]) + ', ' + getTemperature(buffer[2], buffer[3]) + ')';
  }
  console.log('[' + moment().format('YYYY:MM:DD[T]h:mm:ss') + '][' + from + '] Received message: ' + message);
}
