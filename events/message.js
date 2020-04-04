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
    const repoRegex = /(?:\s|^)([\w-.]+)\/([\w-.]+)(?=\s|$)/g;
    const repoMatches = Array.from(message.content.matchAll(repoRegex));

    if (repoMatches.length > 0) {
      message.channel.startTyping();

      const repos = (await Promise.all(
        repoMatches.map(async (match) => {
          const [, owner, repo] = match;
          let info = null;
          try {
            info = await githubRepoInfo.getRepoInfo(owner, repo);
          } catch (error) {
            console.warn(error);
          }

          return info;
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

    const issueRegex = /(?:\s|^)(?:(?:([\w-.]+)\/)?([\w-.]+))?#(\d+)(?=\s|$)/g;
    const issueMatches = Array.from(message.content.matchAll(issueRegex));

    if (issueMatches.length > 0) {
      message.channel.startTyping();

      const issues = (await Promise.all(
        issueMatches.map(async (match) => {
          const owner = match[1] || 'wulkanowy';
          const repo = match[2] || 'wulkanowy';
          const issue = match[3];
          try {
            const info = await githubRepoInfo.getWulkanowyIssueInfo(owner, repo, issue);
            if (!info) return null;
            return {
              ...info,
              repositoryOwner: owner,
              repositoryName: repo,
            };
          } catch (error) {
            console.warn(error);
            return null;
          }
        }),
      ))
        .filter((e) => e !== null);

      await Promise.all(issues.map(async (issue) => {
        const embed = new Discord.MessageEmbed()
          .setTitle(`[#${issue.number}] ${issue.title}`)
          .setURL(issue.url)
          .setAuthor(issue.user.login, issue.user.avatar, issue.user.url)
          .addField('Repozytorium', `${issue.repositoryOwner}/${issue.repositoryName}`)
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

        await message.channel.send(embed);
      }));

      message.channel.stopTyping();
    }
  }
};
