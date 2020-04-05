const Discord = require('discord.js');
const { prune } = require('voca');
const _ = require('lodash');
const githubRepoInfo = require('../utils/githubRepoInfo');

module.exports = async function issueHandler(client, message) {
  const issueRegex = /(?:\s|^)(?:(?:([\w-.]+)\/)?([\w-.]+))?#(\d+)(?=\s|$)/g;
  const issueMatches = Array.from(message.content.matchAll(issueRegex));

  if (issueMatches.length > 0) {
    message.channel.startTyping();

    const issueNames = _.uniqWith(
      issueMatches.map((issueMatch) => ({
        owner: issueMatch[1] || 'wulkanowy',
        repo: issueMatch[2] || 'wulkanowy',
        issue: issueMatch[3],
      })),
      _.isEqual,
    );

    const issues = (await Promise.all(
      issueNames.map(async ({ owner, repo, issue }) => {
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
};
