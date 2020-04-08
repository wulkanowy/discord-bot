import Discord from 'discord.js';
import Client from '../client';
import * as uonetStatus from '../utils/uonet-status';

const statusChannels: Discord.TextChannel[] = [];
let lastStatusCode = 0;

async function performCheck(): Promise<void> {
  try {
    statusChannels.forEach((statusChannel: Discord.TextChannel) => {
      statusChannel.startTyping();
    });
    lastStatusCode = await uonetStatus.sendStatusMessage(statusChannels, 'warszawa', lastStatusCode);
  } catch (error) {
    console.error(error);
    statusChannels.forEach((statusChannel: Discord.TextChannel) => {
      statusChannel.send(`Błąd: \`${error.message}\``);
    });
  }

  statusChannels.forEach((statusChannel: Discord.TextChannel) => {
    statusChannel.stopTyping();
  });
}

export default function readyHandler(client: Client): void {
  client.guilds.cache.forEach((guild: Discord.Guild) => {
    statusChannels.push(guild.channels.cache
      .find((ch: Discord.GuildChannel) => ch.type === 'text' && ch.name === client.config.channels.status) as Discord.TextChannel);
  });

  const statusCheckInterval = client.config.statusInterval * 1000;

  setInterval((): void => {
    performCheck();
  }, statusCheckInterval);

  console.log('Uruchomiono bota :)');
}
