const Discord = require('discord.js');
const FuzzySet = require('fuzzyset.js');
const githubRepoInfo = require('../utils/githubRepoInfo');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(client.config.prefix) === 0) {
    if (message.channel.name !== client.config.channels.bot) return;

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command);

    if (!cmd) {
      const commandsFuzzySet = new FuzzySet(Array.from(client.commands.keys()));
      const match = commandsFuzzySet.get(command, null, 0.5);
      message.channel.send(`Nie ma takiej komendy \`${client.config.prefix}${command}\`\n${match ? `Czy chodziło ci o \`${client.config.prefix}${match[0][1]}\`?\n` : ''}W celu uzyskania pomocy wpisz \`!pomoc\``);
      return;
    }

    cmd.run(client, message, args);
  } else {
    const repoNameRegex = /[\w-]+\/[\w-]+/g;
    const matches = message.content.match(repoNameRegex);

    if (matches === null) return;

    const repos = (await Promise.all(
      matches.map(async (match) => {
        const [owner, repo] = match.split('/');
        let info = null;
        try {
          info = await githubRepoInfo.getRepoInfo(owner, repo);
        } catch (error) {
          console.warn(error);
        }

        return info;
      }),
    ))
      .filter(e => e !== null);

    repos.forEach((repo) => {
      const embed = new Discord.RichEmbed()
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

      message.channel.send(embed);
    });
  }
};
