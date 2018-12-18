const getTitleAtUrl = require('get-title-at-url');

module.exports.studentNew = function() {
  return new Promise((resolve, reject) => {
    getTitleAtUrl("https://uonetplus-uczen.vulcan.net.pl/", function(title, error) {
      if(error) {
        reject(error);
        return;
      }

      resolve(title !== "Przerwa techniczna");
    });
  });
}

module.exports.studentOld = function() {
  return new Promise((resolve, reject) => {
    getTitleAtUrl("https://uonetplus-opiekun.vulcan.net.pl/", function(title, error) {
      if(error) {
        reject(error);
        return;
      }

      resolve(title !== "Przerwa techniczna");
    });
  });
}