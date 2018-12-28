const getTitleAtUrl = require('get-title-at-url');

module.exports.studentNew = () => new Promise((resolve) => {
  getTitleAtUrl('https://uonetplus-uczen.vulcan.net.pl/', (title, error) => {
    if (error) {
      resolve({
        code: module.exports.STATUS_ERROR,
        message: error.message,
      });
      return;
    }

    resolve({
      code: title === 'Przerwa techniczna'
        ? module.exports.STATUS_TECHNICAL_BREAK
        : module.exports.STATUS_WORKING,
    });
  });
});

module.exports.studentOld = () => new Promise((resolve) => {
  getTitleAtUrl('https://uonetplus-opiekun.vulcan.net.pl/', (title, error) => {
    if (error) {
      resolve({
        code: module.exports.STATUS_ERROR,
        message: error.message,
      });
      return;
    }

    resolve({
      code: title === 'Przerwa techniczna'
        ? module.exports.STATUS_TECHNICAL_BREAK
        : module.exports.STATUS_WORKING,
    });
  });
});

module.exports.STATUS_WORKING = 0;
module.exports.STATUS_ERROR = 1;
module.exports.STATUS_TECHNICAL_BREAK = 2;
