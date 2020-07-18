import Discord from 'discord.js';
import Client from '../client';
import * as uonetStatus from '../utils/uonet-status';

const statusChannels: Discord.TextChannel[] = [];
let lastStatusCode = 0;

async function performCheck(): Promise<void> {
  try {
    statusChannels.forEach((statusChannel: Discord.TextChannel) => {
      void statusChannel.startTyping();
    });
    lastStatusCode = await uonetStatus.sendStatusMessage(statusChannels, 'warszawa', lastStatusCode);
  } catch (error) {
    console.error(error);
    await Promise.all(statusChannels.map((statusChannel: Discord.TextChannel) => statusChannel.send(
      `Błąd: \`${error instanceof Error ? error.message : 'Bardzo nietypowy błąd :confused:'}\``,
    )));
  }

  statusChannels.forEach((statusChannel: Discord.TextChannel) => {
    statusChannel.stopTyping();
  });
}

export default async function readyHandler(client: Client): Promise<void> {
  statusChannels.push(client.channels.cache
    .find((ch: Discord.Channel) => ch.id === '522119365265588224') as Discord.TextChannel);

  const statusCheckInterval = client.config.statusInterval * 1000;

  setInterval((): void => {
    void performCheck();
  }, statusCheckInterval);

  await client.user?.setActivity('od mniej niż minuty', {
    type: 'WATCHING',
  });

  let activeTimeMinutes = 1;

  setInterval(async () => {
    if (activeTimeMinutes >= 60 * 48) {
      const activeTimeDays = Math.floor(activeTimeMinutes / 60 / 24);
      await client.user?.setActivity(`od ${activeTimeDays} dni`, {
        type: 'WATCHING',
      });
    } if (activeTimeMinutes >= 60) {
      const activeTimeHours = Math.floor(activeTimeMinutes / 60);
      await client.user?.setActivity(activeTimeHours === 1 ? 'od godziny' : `od ${activeTimeHours} godzin`, {
        type: 'WATCHING',
      });
    } else {
      await client.user?.setActivity(activeTimeMinutes === 1 ? 'od minuty' : `od ${activeTimeMinutes} minut`, {
        type: 'WATCHING',
      });
    }
    activeTimeMinutes += 1;
  }, 60000);

  console.log('Uruchomiono bota :)');
}
