var moment = require('moment');

module.exports = function(from, message, date) {
  date = date || Date.now();
  if(!Buffer.isBuffer(message)) {
    message = JSON.stringify(message);
  }
  console.log('[' + moment.utc(date).format('YYYY:MM:DD[T]hh:mm:ss') + '] [' + from + '] Received message: ' + message);
}
