import Discord from 'discord.js';
import Client from '../client';
import * as uonetStatus from '../utils/uonet-status';

const statusChannels: Discord.TextChannel[] = [];
let lastStatusCode = 0;

async function performCheck(): Promise<void> {
  try {
    const studentNewStatus = await uonetStatus.checkService('https://uonetplus-uczen.vulcan.net.pl/warszawa', 'Uczeń');
    const studentOldStatus = await uonetStatus.checkService('https://uonetplus-opiekun.vulcan.net.pl/warszawa', 'Uczeń');
    const mobileApiStatus = await uonetStatus.checkService('https://lekcjaplus.vulcan.net.pl/warszawa', 'UONET+ dla urządzeń mobilnych');

    const statusCode = (studentNewStatus ? studentNewStatus.code * 3 : 0)
      + (mobileApiStatus ? mobileApiStatus.code * 2 : 0)
      + (studentNewStatus ? studentNewStatus.code : 0);

    if (statusCode !== lastStatusCode) {
      const statusColor = Math.max(
        studentNewStatus?.code || 0,
        studentOldStatus?.code || 0,
        mobileApiStatus?.code || 0,
      ) === uonetStatus.StatusCode.Working ? '2ecc71' : 'f1c40f';

      const embed = new Discord.MessageEmbed()
        .setTitle('Status dzienniczka (dla symbolu *warszawa*)')
        .setColor(statusColor)
        .addField('Nowy moduł uczeń:', uonetStatus.interpretCodeMessage(studentNewStatus))
        .addField('Stary moduł uczeń:', uonetStatus.interpretCodeMessage(studentOldStatus))
        .addField('API mobilne:', uonetStatus.interpretCodeMessage(mobileApiStatus));

      if (Math.max(
        studentNewStatus.code,
        studentOldStatus.code,
        mobileApiStatus.code,
      ) === uonetStatus.StatusCode.Working) {
        embed.setImage('https://i.imgur.com/oBPbqmy.png');
      }

      statusChannels.forEach((statusChannel: Discord.TextChannel) => {
        statusChannel.send({ embed });
      });
    }

    lastStatusCode = statusCode;
  } catch (error) {
    console.error(error);
    statusChannels.forEach((statusChannel: Discord.TextChannel) => {
      statusChannel.send(`Błąd: \`${error.message}\``);
    });
  }
}

export default function readyHandler(client: Client): void {
  client.guilds.cache.forEach((guild: Discord.Guild) => {
    statusChannels.push(guild.channels.cache
      .find((ch: Discord.GuildChannel) => ch.type === 'text' && ch.name === client.config.channels.status) as Discord.TextChannel);
  });

  const interval = client.config.statusInterval * 1000;

  setInterval((): void => {
    performCheck();
  }, interval);

  console.log('Uruchomiono bota :)');
}
