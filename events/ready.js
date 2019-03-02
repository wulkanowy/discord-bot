const Discord = require('discord.js');
const uonetStatus = require('../utils/uonetStatus');

const statusChannels = [];
let lastStatusCode = 0;

module.exports = (client) => {
  client.guilds.forEach((guild) => {
    statusChannels.push(guild.channels.find(ch => ch.name === client.config.channels.status));
  });

  const interval = client.config.statusInterval * 1000;

  setInterval(async () => {
    let studentNewStatus = null;
    let studentOldStatus = null;

    try {
      studentNewStatus = await uonetStatus.studentNew();
      studentOldStatus = await uonetStatus.studentOld();
    } catch (error) {
      statusChannels.forEach((statusChannel) => {
        statusChannel.channel.send(`Błąd: \`${error.message}\``);
      });
    }

    const statusCode = (studentNewStatus.code * 3) + (studentOldStatus.code);

    if (statusCode !== lastStatusCode) {
      const statusColor = Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING ? '2ecc71' : 'f1c40f';

      let studentNewMessage = '';

      if (studentNewStatus.code === uonetStatus.STATUS_WORKING) studentNewMessage = ':white_check_mark: Wszystko powinno działać poprawnie';
      else if (studentNewStatus.code === uonetStatus.STATUS_ERROR) {
        studentNewMessage = studentNewStatus.message
          ? `:warning: Błąd: \`${studentNewStatus.message}\``
          : ':warning: Błąd sprawdzania statusu';
      } else if (studentNewStatus.code === uonetStatus.STATUS_TECHNICAL_BREAK) {
        studentNewMessage = '<:przerwa:537743331875225601> Przerwa techniczna';
      }

      let studentOldMessage = '';

      if (studentOldStatus.code === uonetStatus.STATUS_WORKING) studentOldMessage = ':white_check_mark: Wszystko powinno działać poprawnie';
      else if (studentOldStatus.code === uonetStatus.STATUS_ERROR) {
        studentOldMessage = studentOldStatus.message
          ? `:warning: Błąd: \`${studentOldStatus.message}\``
          : ':warning: Błąd sprawdzania statusu';
      } else if (studentOldStatus.code === uonetStatus.STATUS_TECHNICAL_BREAK) {
        studentOldMessage = '<:przerwa:537743331875225601> Przerwa techniczna';
      }

      const embed = new Discord.RichEmbed()
        .setTitle('Status dzienniczka się zmienił!')
        .setColor(statusColor)
        .addField('Nowy moduł uczeń:', studentNewMessage)
        .addField('Stary moduł uczeń:', studentOldMessage);

      if (Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING) {
        embed.setImage('https://imgur.com/FcPd2Nf.png');
      }

      statusChannels.forEach((statusChannel) => {
        statusChannel.send({ embed });
      });
    }

    lastStatusCode = statusCode;
  }, interval);

  console.log('Uruchomiono bota :)');
};
