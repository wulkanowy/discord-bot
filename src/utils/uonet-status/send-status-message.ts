import Discord from 'discord.js';
import { checkService, interpretCodeMessage, StatusCode } from '.';

export default async function sendStatusMessage(
  channels: Array<Discord.TextChannel | Discord.DMChannel>,
  symbol: string,
  lastStatusCode: number | undefined = undefined,
): Promise<number> {
  const studentNewStatus = await checkService(`https://uonetplus-uczen.vulcan.net.pl/${symbol}`, 'Uczeń');
  const studentOldStatus = await checkService(`https://uonetplus-opiekun.vulcan.net.pl/${symbol}`, 'Uczeń');
  const mobileApiStatus = await checkService(`https://lekcjaplus.vulcan.net.pl/${symbol}`, 'UONET+ dla urządzeń mobilnych');

  const statusCode = (studentNewStatus ? studentNewStatus.code * 3 : 0)
    + (mobileApiStatus ? mobileApiStatus.code * 2 : 0)
    + (studentNewStatus ? studentNewStatus.code : 0);

  if (lastStatusCode === undefined || statusCode !== lastStatusCode) {
    const statusColor = Math.max(
      studentNewStatus?.code || 0,
      studentOldStatus?.code || 0,
      mobileApiStatus?.code || 0,
    ) === StatusCode.Working ? '2ecc71' : 'f1c40f';

    const embed = new Discord.MessageEmbed()
      .setTitle(`Status dzienniczka (dla symbolu *${symbol}*)`)
      .setColor(statusColor)
      .addField('Nowy moduł uczeń:', interpretCodeMessage(studentNewStatus))
      .addField('Stary moduł uczeń:', interpretCodeMessage(studentOldStatus))
      .addField('API mobilne:', interpretCodeMessage(mobileApiStatus));

    if (Math.max(
      studentNewStatus.code,
      studentOldStatus.code,
      mobileApiStatus.code,
    ) === StatusCode.Working) {
      embed.setImage('https://i.imgur.com/oBPbqmy.png');
    }

    channels.forEach((statusChannel: Discord.TextChannel | Discord.DMChannel) => {
      statusChannel.send({ embed });
    });
  }

  return statusCode;
}