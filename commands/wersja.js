const Discord = require('discord.js');
const appVersion = require('../utils/appVersion');

exports.run = async (client, message) => {
  message.channel.startTyping();

  let betaBuild;
  let devMasterBuild;
  let devPrBuilds;
  try {
    betaBuild = await appVersion.getBetaBuild();
    devMasterBuild = await appVersion.getDevMasterBuild();
    devPrBuilds = await appVersion.getDevPrBuilds();
  } catch (error) {
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  let devMessage = '';

  devMessage += `- ***master***: **${devMasterBuild.version}** opublikowana **${new Date(devMasterBuild.publishedAt).toLocaleString('pl-PL', {
    timeZone: 'Europe/Warsaw',
    hour12: false,
  })}**`;

  devPrBuilds.forEach((build) => {
    devMessage += `\n- *${build.branch}*: **${build.version}** opublikowana **${new Date(build.publishedAt).toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      hour12: false,
    })}**`;
  });

  const embed = new Discord.RichEmbed()
    .setAuthor('Najnowsze wersje Wulkanowego', 'https://doteq.pinglimited.me/515xf8.png')
    .setColor('F44336')
    .addField('Wersja beta', `**v${betaBuild.version}** opublikowana **${new Date(betaBuild.publishedAt).toLocaleString('pl-PL', {
      timeZone: 'Europe/Warsaw',
      hour12: false,
    })}**`)
    .addField('Wersja DEV', devMessage);
  message.channel.send({ embed });
  message.channel.stopTyping();
};
