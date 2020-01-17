const Discord = require('discord.js');
const uonetStatus = require('../utils/uonetStatus');

exports.run = async (client, message) => {
  message.channel.startTyping();

  let studentNewStatus = {};
  let studentOldStatus = {};
  try {
    studentNewStatus = await uonetStatus.checkService('https://uonetplus-uczen.vulcan.net.pl/warszawa', 'Uczeń');
    studentOldStatus = await uonetStatus.checkService('https://uonetplus-opiekun.vulcan.net.pl/warszawa', 'Uczeń');
  } catch (error) {
    console.error(error);
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  const statusColor = Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING ? '2ecc71' : 'f1c40f';

  const embed = new Discord.RichEmbed()
    .setTitle('Status dzienniczka')
    .setColor(statusColor)
    .addField('Nowy moduł uczeń:', uonetStatus.interpretCodeMessage(studentNewStatus))
    .addField('Stary moduł uczeń:', uonetStatus.interpretCodeMessage(studentOldStatus));

  if (Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING) {
    embed.setImage('https://i.imgur.com/oBPbqmy.png');
  }

  message.channel.send({ embed });
  message.channel.stopTyping();
};
