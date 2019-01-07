const Discord = require('discord.js');
const appVersion = require('../utils/appVersion');

exports.run = async (client, message) => {
  message.channel.startTyping();

  let beta = {};
  let dev = [];
  try {
    beta = await appVersion.getBetaBuild();
    dev = await appVersion.getDevBuilds();
  } catch (error) {
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  const devMaster = dev.splice(dev.findIndex(e => e.branch === 'master'), 1)[0];

  let devMessage = '';

  devMessage += `- ***master***: **${devMaster.version}** opublikowana **${new Date(devMaster.publishedAt).toLocaleString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    hour12: false,
  })}**`;

  dev.forEach((element) => {
    devMessage += `\n- *${element.branch}*: **${element.version}** opublikowana **${new Date(element.publishedAt).toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      hour12: false,
    })}**`;
  });

  const embed = new Discord.RichEmbed()
    .setAuthor('Najnowsze wersje Wulkanowego', 'https://doteq.pinglimited.me/515xf8.png')
    .setColor('F44336')
    .addField('Wersja beta', `**v${beta.version}** opublikowana **${new Date(beta.publishedAt).toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      hour12: false,
    })}**`)
    .addField('Wersja DEV', devMessage);
  message.channel.send({ embed });
  message.channel.stopTyping();
};
