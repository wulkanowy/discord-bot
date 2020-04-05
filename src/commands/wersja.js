const moment = require('moment-timezone');
const pobierz = require('./pobierz');

moment.locale('pl');

exports.run = pobierz.run;
