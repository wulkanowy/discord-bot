import Discord from 'discord.js';
import { checkService, interpretCodeMessage, StatusCode } from '.';

export default async function sendStatusMessage(
  channels: Array<Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel>,
  symbol: string,
  lastStatusCode: number | undefined = undefined,
  host: string | undefined = 'vulcan.net.pl',
  mobileUrl: string | undefined = 'https://lekcjaplus.vulcan.net.pl',
  expectedTitle: string | undefined = 'Uczeń',
): Promise<number> {
  const [studentNewStatus, studentOldStatus, mobileApiStatus] = await Promise.all([
    checkService(`https://uonetplus-uczen.${host}/${symbol}`, expectedTitle),
    checkService(`https://uonetplus-opiekun.${host}/${symbol}`, expectedTitle),
    checkService(`${mobileUrl}/${symbol}`, 'UONET+ dla urządzeń mobilnych'),
  ]);
  console.log(`https://uonetplus-uczen.${host}/${symbol}`);

  const statusCode = (studentNewStatus ? studentNewStatus.code : 0)
    + (mobileApiStatus ? mobileApiStatus.code * 8 : 0)
    + (studentNewStatus ? studentNewStatus.code * 64 : 0);

  if (lastStatusCode === undefined || statusCode !== lastStatusCode) {
    const statusColor = Math.max(
      studentNewStatus?.code || 0,
      studentOldStatus?.code || 0,
      mobileApiStatus?.code || 0,
    ) === StatusCode.Working ? '2ecc71' : 'f1c40f';

    const embed = new Discord.MessageEmbed()
      .setTitle(`Status dzienniczka ${host} (dla symbolu *${symbol}*)`)
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

    await Promise.all(channels.map(
      (statusChannel) => statusChannel.send({ embed }),
    ));
  }

  return statusCode;
}
