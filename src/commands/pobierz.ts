import moment from 'moment-timezone';
import Discord from 'discord.js';
import Client from '../client';
import * as appVersion from '../utils/app-version';

moment.locale('pl');

function getBuildLinks(
  develop: appVersion.DevBuild,
  prs: appVersion.DevBuild[],
  rich: boolean,
): string {
  if (rich) {
    return `- ***[develop](${develop.url})***: **${develop.version}** opublikowana **${moment(develop.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()}**\n${
      prs
        .map((build: appVersion.DevBuild) => `- *[${build.branch}](${build.url})*: **${build.version}** opublikowana **${moment(build.publishedAt).tz('Europe/Warsaw').calendar().toLowerCase()}**`)
        .join('\n')
    }`;
  }
  return `- develop: ${develop.url} - ${develop.version}\n${prs.map((build: appVersion.DevBuild) => `- ${build.branch}: ${build.url} - ${build.version}`).join('\n')}`;
}

export default async function pobierz(client: Client, message: Discord.Message): Promise<void> {
  message.channel.startTyping();

  try {
    const betaBuild = await appVersion.getBetaBuild();
    const devDevelopBuild = await appVersion.getDevelopBuild();
    const devPrBuilds = await appVersion.getPrBuilds();

    const buildMessageRich = getBuildLinks(devDevelopBuild, devPrBuilds, true);
    const buildMessagePlain = getBuildLinks(devDevelopBuild, devPrBuilds, false);

    const embed = new Discord.MessageEmbed()
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
      await message.channel.send({ embed });
    } else if (buildMessagePlain.length < 1024) {
      embed.addField('Wersja DEV', buildMessagePlain);
      await message.channel.send({ embed });
    } else if (buildMessagePlain.length < 2048) {
      await message.channel.send(buildMessagePlain, { embed });
    } else {
      embed.addField('Wersja DEV', 'Zbyt dużo buildów. Odwiedź [naszą stroną domową](https://wulkanowy.github.io/#download) by pobrać jakiegoś');
      await message.channel.send({ embed });
    }
  } catch (error) {
    await message.channel.send(`Błąd: \`${error.message}\``);
  }
  message.channel.stopTyping();
}
