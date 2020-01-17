const Discord = require('discord.js');
const moment = require('moment-timezone');
const appVersion = require('../utils/appVersion');

moment.locale('pl');

function getBuildLinks(develop, prs, rich) {
  if (rich) {
    return `- ***[develop](${develop.url})***: **${develop.version}** opublikowana **${moment(develop.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()}**\n${prs
      .map((build) => `- *[${build.branch}](${build.url})*: **${build.version}** opublikowana **${moment(build.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()}**`)
      .join('\n')}`;
  }
  return `- develop: ${develop.url} - ${develop.version}\n${prs.map((build) => `- ${build.branch}: ${build.url} - ${build.version}`).join('\n')}`;
}

exports.run = async (client, message) => {
  message.channel.startTyping();

  let betaBuild;
  let devDevelopBuild;
  let devPrBuilds;
  try {
    betaBuild = await appVersion.getBetaBuild();
    devDevelopBuild = await appVersion.getDevelopBuild();
    devPrBuilds = await appVersion.getPrBuilds();
  } catch (error) {
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  const buildMessageRich = getBuildLinks(devDevelopBuild, devPrBuilds, true);
  const buildMessagePlain = getBuildLinks(devDevelopBuild, devPrBuilds, false);

  const embed = new Discord.RichEmbed()
    .setAuthor('Pobierz Wulkanowy!', 'https://cdn.discordapp.com/attachments/523847362632744975/546459616188563477/nr_logo_wulkanowy2.png')
    .addField('Strona internetowa', 'https://wulkanowy.github.io/')
    .setColor('F44336')
    .addField('Wersja beta',
      `Aktualna wersja: **v${betaBuild.version}** opublikowana **${
        moment(betaBuild.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()
      }**\n`
      + '[Sklep Play](https://play.google.com/store/apps/details?id=io.github.wulkanowy) | '
      + `[GitHub](${betaBuild.url}) | `
      + `[Direct](${betaBuild.directUrl})`);

  if (buildMessageRich.length < 1024) {
    embed.addField('Wersja DEV', buildMessageRich);
    message.channel.send({ embed });
  } else if (buildMessagePlain.length < 1024) {
    embed.addField('Wersja DEV', buildMessagePlain);
    message.channel.send({ embed });
  } else if (buildMessagePlain.length < 2048) {
    message.channel.send(buildMessagePlain, { embed });
  } else {
    embed.addField('Wersja DEV', 'Zbyt dużo buildów. Odwiedź [naszą stroną domową](https://wulkanowy.github.io/#download) by pobrać jakiegoś');
    message.channel.send({ embed });
  }
  message.channel.stopTyping();
};
