const parse = require('node-html-parser').parse;
const rp = require('request-promise');

module.exports.checkService = (url, expect) => rp(url).then((res) => {
  const doc = parse(res);
  const title = doc.querySelector("title").text;

  if (expect === title) return {
    code: module.exports.STATUS_WORKING,
    message: "Nie znaleziono problemów"
  };

  if ("Przerwa techniczna" === title) return {
    code: module.exports.STATUS_TECHNICAL_BREAK,
    message: title
  };

  return {
    code: module.exports.STATUS_ERROR,
    message: `Nieznana odpowiedź: ${title}`
  }
}).catch((err) => {
  console.error(err);
  return {
    code: module.exports.STATUS_ERROR,
    message: err.message
  }
});

module.exports.STATUS_WORKING = 0;
module.exports.STATUS_ERROR = 1;
module.exports.STATUS_TECHNICAL_BREAK = 2;
