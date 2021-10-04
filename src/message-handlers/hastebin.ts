import Discord from 'discord.js';
import * as hastebin from '../utils/hastebin';
import Client from '../client';

export default async function hastebinHandler(
  client: Client,
  message: Discord.Message,
): Promise<boolean> {
  if (message.content.startsWith('==') && message.content.endsWith('==')) {
    const text = message.content.slice(2, -2);

    if (text.length === 0) return false;

    try {
      // await message.channel.sendTyping();

      const key = await hastebin.send(text);
      await message.channel.send({
        embeds: [{
          color: 11062,
          author: {
            name: message.author.username,
            icon_url: message.author.avatarURL()?.trim(),
          },
          title: `hastebin.cf/${key}`,
          url: `https://hastebin.cf/${key}`,
        }],
      });
      await message.delete();
    } catch (error) {
      console.error(error);
      await message.channel.send(`Błąd: \`${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\``);
      return false;
    }

    return true;
  }

  return false;
}
