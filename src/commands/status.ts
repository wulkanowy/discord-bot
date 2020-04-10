import Discord from 'discord.js';
import * as uonetStatus from '../utils/uonet-status';
import Client from '../client';

export default async function status(
  client: Client,
  message: Discord.Message,
  args: string[],
): Promise<void> {
  message.channel.startTyping();

  const symbol = args[0] || 'warszawa';

  try {
    await uonetStatus.sendStatusMessage([message.channel], symbol);
  } catch (error) {
    console.error(error);
    message.channel.send(`Błąd: \`${error.message}\``);
  }

  message.channel.stopTyping();
}
