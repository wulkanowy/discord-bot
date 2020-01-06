const Discord = require('discord.js');
const FuzzySet = require('fuzzyset.js');
const { prune } = require('voca');
const githubRepoInfo = require('../utils/githubRepoInfo');
const hastebinSender = require('../utils/hastebin.js');

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
    if (message.content.startsWith('==') && message.content.slice(-2) === '==') {
      if (message.content.slice(2, -2).length === 0) return;
      hastebinSender.run(client, message);
      return;
    }
    const repoNameRegex = /[\w-]+\/[\w-]+/g;
    const repoNameMatches = message.content.match(repoNameRegex);

    if (repoNameMatches !== null) {
      const repos = (await Promise.all(
        repoNameMatches.map(async (match) => {
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

    const issueNumberRegex = /\s#\d+\s/g;
    const issueNumberMatches = ` ${message.content} `.match(issueNumberRegex);

    if (issueNumberMatches !== null) {
      const issues = (await Promise.all(
        issueNumberMatches.map(async (match) => {
          let info = null;
          try {
            info = await githubRepoInfo.getWulkanowyIssueInfo(match.trim().substring(1));
          } catch (error) {
            console.warn(error);
          }

          return info;
        }),
      ))
        .filter(e => e !== null);

      issues.forEach((issue) => {
        const embed = new Discord.RichEmbed()
          .setTitle(`[#${issue.number}] ${issue.title}`)
          .setURL(issue.url)
          .setAuthor(issue.user.login, issue.user.avatar, issue.user.url)
          .setFooter(
            'GitHub',
            'https://i.imgur.com/LGyvq8p.png',
          );

        if (issue.type === 'issue') embed.addField('Typ', 'Issue');
        else if (issue.type === 'pull') embed.addField('Typ', 'Pull request');

        if (issue.state === 'open') embed.addField('Stan', 'Otwarty');
        else if (issue.state === 'closed') embed.addField('Stan', issue.merged ? 'Merged' : 'Zamknięty');

        if (issue.type === 'pull' && issue.state === 'open') embed.addField('Wersja robocza', issue.draft ? 'Tak' : 'Nie');

        if (issue.description) {
          embed.setDescription(prune(issue.description, 512, '\n(...)'));
        } else {
          embed.setDescription('Brak opisu');
        }

        if (issue.merged) embed.setColor('6f42c1');
        else if (issue.draft) embed.setColor('#6a737d');
        else if (issue.state === 'open') embed.setColor('2cbe4e');
        else embed.setColor('#cb2431');

        message.channel.send(embed);
      });
    }
  }
};
