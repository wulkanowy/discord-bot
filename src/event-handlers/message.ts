import Discord from 'discord.js';
import Client from '../client';
import hastebinHandler from '../message-handlers/hastebin';
import repoHandler from '../message-handlers/repo-handler';
import issueHandler from '../message-handlers/issue-handler';
import commandHandler from '../message-handlers/command';

export default async function messageHandler(
  client: Client,
  message: Discord.Message,
): Promise<void> {
  if (message.author.bot) return;

  if (await commandHandler(client, message)) return;
  if (await hastebinHandler(client, message)) return;
  await repoHandler(client, message);
  await issueHandler(client, message);
}
