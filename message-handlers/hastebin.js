const hastebinSender = require('../utils/hastebin');

module.exports = function hastebinHandler(client, message) {
  if (message.content.startsWith('==') && message.content.slice(-2) === '==') {
    if (message.content.slice(2, -2).length === 0) return false;

    hastebinSender.run(client, message);

    return true;
  }

  return false;
};
