const { parse } = require('node-html-parser');
const rp = require('request-promise');

module.exports.checkService = (url, expect) => rp(url).then((res) => {
  const doc = parse(res);
  const title = doc.querySelector('title').text;

  if (expect === title) {
    return {
      code: module.exports.STATUS_WORKING,
      message: 'Nie znaleziono problemów',
    };
  }

  if (title === 'Przerwa techniczna') {
    return {
      code: module.exports.STATUS_TECHNICAL_BREAK,
      message: title,
    };
  }

  return {
    code: module.exports.STATUS_ERROR,
    message: `Nieznana odpowiedź: ${title}`,
  };
}).catch((err) => {
  console.error(err);
  return {
    code: module.exports.STATUS_ERROR,
    message: err.message,
  };
});

module.exports.interpretCodeMessage = (status) => {
  if (status.code === module.exports.STATUS_WORKING) return ':white_check_mark: Wszystko powinno działać poprawnie';

  if (status.code === module.exports.STATUS_ERROR) {
    return status.message ? `:warning: Błąd: \`${status.message}\`` : ':warning: Błąd sprawdzania statusu';
  }

  if (status.code === module.exports.STATUS_TECHNICAL_BREAK) {
    return '<:przerwa:537743331875225601> Przerwa techniczna';
  }

  return '';
};

module.exports.STATUS_WORKING = 0;
module.exports.STATUS_ERROR = 1;
module.exports.STATUS_TECHNICAL_BREAK = 2;
