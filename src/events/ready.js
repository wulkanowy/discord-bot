const Discord = require('discord.js');
const uonetStatus = require('../utils/uonetStatus');

const statusChannels = [];
let lastStatusCode = 0;

module.exports = (client) => {
  client.guilds.cache.forEach((guild) => {
    statusChannels.push(guild.channels.cache
      .find((ch) => ch.name === client.config.channels.status));
  });

  const interval = client.config.statusInterval * 1000;

  setInterval(async () => {
    let studentNewStatus = {};
    let studentOldStatus = {};
    let mobileApiStatus = {};

    try {
      studentNewStatus = await uonetStatus.checkService('https://uonetplus-uczen.vulcan.net.pl/warszawa', 'Uczeń');
      studentOldStatus = await uonetStatus.checkService('https://uonetplus-opiekun.vulcan.net.pl/warszawa', 'Uczeń');
      mobileApiStatus = await uonetStatus.checkService('https://lekcjaplus.vulcan.net.pl/warszawa', 'UONET+ dla urządzeń mobilnych');
    } catch (error) {
      console.error(error);
      statusChannels.forEach((statusChannel) => {
        statusChannel.channel.send(`Błąd: \`${error.message}\``);
      });
    }

    const statusCode = (studentNewStatus.code * 3)
      + (mobileApiStatus.code * 2) + (studentOldStatus.code);

    if (statusCode !== lastStatusCode) {
      const statusColor = Math.max(
        studentNewStatus.code,
        studentOldStatus.code,
        mobileApiStatus.code,
      ) === uonetStatus.STATUS_WORKING ? '2ecc71' : 'f1c40f';

      const embed = new Discord.MessageEmbed()
        .setTitle('Status dzienniczka (dla symbolu *warszawa*)')
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

      statusChannels.forEach((statusChannel) => {
        statusChannel.send({ embed });
      });
    }

    lastStatusCode = statusCode;
  }, interval);

  console.log('Uruchomiono bota :)');
};
