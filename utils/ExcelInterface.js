const converter = require('json-2-csv');
const fs = require('fs');

class ExcelInterface {
  constructor(data) {
    this.csv = null;
    this.json = data;
  }

  buildCSV() {
    return new Promise((fnResolve, fnReject) => (
      // eslint-disable-next-line no-promise-executor-return
      converter.json2csv(this.json, (err, csv) => {
        if (err) {
          fnReject(err);
          throw err;
        }

        this.csv = csv;
        fnResolve(csv);
      })
    ));
  }

  saveToDesktop() {
    fs.writeFileSync(`./spreadsheets/${new Date().toJSON()}.csv`, this.csv);
  }
}

module.exports = ExcelInterface;
