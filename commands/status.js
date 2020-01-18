const Discord = require('discord.js');
const uonetStatus = require('../utils/uonetStatus');

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  let symbol = 'warszawa';
  if (args[0]) {
    [symbol] = args;
  }

  let studentNewStatus = {};
  let studentOldStatus = {};
  let mobileApiStatus = {};

  try {
    studentNewStatus = await uonetStatus.checkService(`https://uonetplus-uczen.vulcan.net.pl/${symbol}`, 'Uczeń');
    studentOldStatus = await uonetStatus.checkService(`https://uonetplus-opiekun.vulcan.net.pl/${symbol}`, 'Uczeń');
    mobileApiStatus = await uonetStatus.checkService(`https://lekcjaplus.vulcan.net.pl/${symbol}`, 'UONET+ dla urządzeń mobilnych');
  } catch (error) {
    console.error(error);
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  const statusColor = Math.max(studentNewStatus.code, studentOldStatus.code, mobileApiStatus.code) === uonetStatus.STATUS_WORKING ? '2ecc71' : 'f1c40f';

  const embed = new Discord.RichEmbed()
    .setTitle(`Status dzienniczka (dla symbolu *${symbol}*)`)
    .setColor(statusColor)
    .addField('Nowy moduł uczeń:', uonetStatus.interpretCodeMessage(studentNewStatus))
    .addField('Stary moduł uczeń:', uonetStatus.interpretCodeMessage(studentOldStatus))
    .addField('API mobilne:', uonetStatus.interpretCodeMessage(mobileApiStatus));

  if (Math.max(
    studentNewStatus.code,
    studentOldStatus.code,
    mobileApiStatus.code,
  ) === uonetStatus.STATUS_WORKING) {
    embed.setImage('https://i.imgur.com/oBPbqmy.png');
  }

  message.channel.send({ embed });
  message.channel.stopTyping();
};
