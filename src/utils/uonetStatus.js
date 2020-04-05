const cheerio = require('cheerio');
const rp = require('request-promise');

module.exports.checkService = (url, expect) => rp(url).then((res) => {
  console.log(`Check status for ${url}`);
  const $ = cheerio.load(res);
  const title = $('title').text();

  if (res.includes('Podany identyfikator klienta jest niepoprawny')) {
    return {
      code: module.exports.STATUS_ERROR,
      message: $('#MainPage_ErrorDiv div').html().split('</h2>')[1].split('<br>')[0],
    };
  }

  if (res.includes('Podany symbol grupujący jest nieprawidłowy')) {
    return {
      code: module.exports.STATUS_ERROR,
      message: $('.block .blockInner').text().trim(),
    };
  }

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
