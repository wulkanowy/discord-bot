import Discord from 'discord.js';
import { prune } from 'voca';
import _ from 'lodash';
import * as GitHub from '../utils/github';
import Client from '../client';

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export default async function issueHandler(
  client: Client,
  message: Discord.Message,
): Promise<void> {
  const issueRegex = /(?:\s|^)(?:(?:([\w-.]+)\/)?([\w-.]+))?#(\d+)(?=\s|$)/g;
  const issueMatches = Array.from(message.content.matchAll(issueRegex));

  if (issueMatches.length > 0) {
    message.channel.startTyping();

    const issueNames = _.uniqWith(
      issueMatches.map((issueMatch: RegExpMatchArray) => ({
        owner: issueMatch[1] || 'wulkanowy',
        repo: issueMatch[2] || 'wulkanowy',
        issue: parseInt(issueMatch[3], 10),
      })),
      _.isEqual,
    ).filter(notEmpty);

    const issues = (await Promise.all(
      issueNames.map(async (
        { owner, repo, issue }: { owner: string; repo: string; issue: number},
      ) => {
        try {
          const info = await GitHub.getIssueInfo(owner, repo, issue);
          if (!info) return null;
          return info;
        } catch (error) {
          console.warn(error);
          return null;
        }
      }),
    ))
      .filter(notEmpty);

    await Promise.all(issues.map(async (issue: GitHub.IssueInfo | GitHub.PullInfo) => {
      const embed = new Discord.MessageEmbed()
        .setTitle(`[#${issue.number}] ${issue.title}`)
        .setURL(issue.url)
        .setAuthor(issue.user.login, issue.user.avatar, issue.user.url)
        .setFooter(
          'GitHub',
          'https://i.imgur.com/LGyvq8p.png',
        );

      if (issue.type === 'issue') embed.addField('Repozytorium', `${issue.owner}/${issue.repo}`);

      if (issue.type === 'issue') embed.addField('Typ', 'Issue');
      else if (issue.type === 'pull') embed.addField('Typ', 'Pull request');

      if (issue.open) embed.addField('Stan', 'Otwarty');
      else embed.addField('Stan', issue.type === 'pull' && issue.merged ? 'Merged' : 'Zamknięty');

      if (issue.type === 'pull' && issue.open) embed.addField('Wersja robocza', issue.draft ? 'Tak' : 'Nie');

      if (issue.description) {
        embed.setDescription(prune(issue.description, 512, '\n(...)'));
      } else {
        embed.setDescription('Brak opisu');
      }

      if (issue.type === 'pull' && issue.merged) embed.setColor('#6f42c1');
      else if (issue.type === 'pull' && issue.draft) embed.setColor('#6a737d');
      else if (issue.open) embed.setColor('#2cbe4e');
      else embed.setColor('#cb2431');

      await message.channel.send(embed);
    }));

    message.channel.stopTyping();
  }
}
