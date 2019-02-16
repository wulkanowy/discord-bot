const Discord = require('discord.js');
const moment = require('moment-timezone');
const appVersion = require('../utils/appVersion');

moment.locale('pl');

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

  devMessage += `- ***master***: **${devMasterBuild.version}** opublikowana **${
    moment(devMasterBuild.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()
  }**`;

  devPrBuilds.forEach((build) => {
    devMessage += `\n- *${build.branch}*: **${build.version}** opublikowana **${
      moment(build.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()
    }**`;
  });

  const embed = new Discord.RichEmbed()
    .setAuthor('Najnowsze wersje Wulkanowego', 'https://cdn.discordapp.com/attachments/523847362632744975/546459616188563477/nr_logo_wulkanowy2.png')
    .setColor('F44336')
    .addField('Wersja beta', `**v${betaBuild.version}** opublikowana **${
      moment(betaBuild.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()
    }**`)
    .addField('Wersja DEV', devMessage);
  message.channel.send({ embed });
  message.channel.stopTyping();
};
