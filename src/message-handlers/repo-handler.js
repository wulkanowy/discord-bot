const Discord = require('discord.js');
const _ = require('lodash');
const githubRepoInfo = require('../utils/githubRepoInfo');

module.exports = async function repoHandler(client, message) {
  const repoRegex = /(?:\s|^)([\w-.]+)\/([\w-.]+)(?=\s|$)/g;
  const repoMatches = Array.from(message.content.matchAll(repoRegex));

  if (repoMatches.length > 0) {
    message.channel.startTyping();

    const repoNames = _.uniqWith(
      repoMatches.map((repoMatch) => ({
        owner: repoMatch[1],
        repo: repoMatch[2],
      })),
      _.isEqual,
    );

    const repos = (await Promise.all(
      repoNames.map(async ({ owner, repo }) => {
        try {
          return await githubRepoInfo.getRepoInfo(owner, repo);
        } catch (error) {
          console.warn(error);
          return null;
        }
      }),
    ))
      .filter((e) => e !== null);

    await Promise.all(repos.map(async (repo) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`${repo.name}`)
        .setURL(repo.url)
        .setThumbnail(repo.avatar)
        .setFooter(
          'GitHub',
          'https://i.imgur.com/LGyvq8p.png',
        )
        .setColor('ffeb3b');

      if (repo.description) {
        embed.setDescription(repo.description);
      } else {
        embed.setDescription('Brak opisu');
      }

      if (repo.homepage) {
        embed.addField('Strona domowa', repo.homepage);
      }
      embed.addField('Gwiazdki', repo.stars);

      await message.channel.send(embed);
    }));

    message.channel.stopTyping();
  }
};
