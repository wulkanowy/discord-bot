const Discord = require('discord.js');
const uonetStatus = require('../utils/uonetStatus');

const statusChannels = [];
let lastStatusCode = 0;

module.exports = (client) => {
  client.guilds.forEach((guild) => {
    statusChannels.push(guild.channels.find((ch) => ch.name === client.config.channels.status));
  });

  const interval = client.config.statusInterval * 1000;

  setInterval(async () => {
    let studentNewStatus = {};
    let studentOldStatus = {};

    try {
      studentNewStatus = await uonetStatus.checkService('https://uonetplus-uczen.vulcan.net.pl/warszawa', 'Uczeń');
      studentOldStatus = await uonetStatus.checkService('https://uonetplus-opiekun.vulcan.net.pl/warszawa', 'Uczeń');
    } catch (error) {
      console.error(error);
      statusChannels.forEach((statusChannel) => {
        statusChannel.channel.send(`Błąd: \`${error.message}\``);
      });
    }

    const statusCode = (studentNewStatus.code * 3) + (studentOldStatus.code);

    if (statusCode !== lastStatusCode) {
      const statusColor = Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING ? '2ecc71' : 'f1c40f';

      const embed = new Discord.RichEmbed()
        .setTitle('Status dzienniczka się zmienił!')
        .setColor(statusColor)
        .addField('Nowy moduł uczeń:', uonetStatus.interpretCodeMessage(studentNewStatus))
        .addField('Stary moduł uczeń:', uonetStatus.interpretCodeMessage(studentOldStatus));

      if (Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING) {
        embed.setImage('https://i.imgur.com/oBPbqmy.png');
      }

      statusChannels.forEach((statusChannel) => {
        statusChannel.send({ embed });
      });
    }

    lastStatusCode = statusCode;
  }, interval);

  console.log('Uruchomiono bota :)');
};
