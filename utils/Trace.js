const moment = require('moment');

class Trace {
  static info(info) {
    console.log(`[${moment().format('LTS')}] >> ${info}`);
  }

  static error(error) {
    console.error(error);
  }
}

module.exports = Trace;
