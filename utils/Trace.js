const moment = require('moment');

class Trace {
  static info(info) {
    console.log(`[${moment().format('LTS')}] >> ${info}`);
  }

  static error(error) {
    console.error(`[${moment().format('LTS')}] >> ${error}`);
  }
}

module.exports = Trace;
