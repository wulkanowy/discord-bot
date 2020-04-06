import Discord from 'discord.js';
import * as uonetStatus from '../utils/uonet-status';
import Client from '../client';

export default async function status(
  client: Client,
  message: Discord.Message,
  args: string[],
): Promise<void> {
  await message.channel.startTyping();

  let symbol = 'warszawa';
  if (args[0]) {
    [symbol] = args;
  }

  let studentNewStatus: uonetStatus.ServiceStatus;
  let studentOldStatus: uonetStatus.ServiceStatus;
  let mobileApiStatus: uonetStatus.ServiceStatus;

  try {
    studentNewStatus = await uonetStatus.checkService(`https://uonetplus-uczen.vulcan.net.pl/${symbol}`, 'Uczeń');
    studentOldStatus = await uonetStatus.checkService(`https://uonetplus-opiekun.vulcan.net.pl/${symbol}`, 'Uczeń');
    mobileApiStatus = await uonetStatus.checkService(`https://lekcjaplus.vulcan.net.pl/${symbol}`, 'UONET+ dla urządzeń mobilnych');
  } catch (error) {
    console.error(error);
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  const statusColor = Math.max(
    studentNewStatus.code || 0,
    studentOldStatus.code || 0,
    mobileApiStatus.code || 0,
  ) === uonetStatus.StatusCode.Working ? '2ecc71' : 'f1c40f';

  const embed = new Discord.MessageEmbed()
    .setTitle(`Status dzienniczka (dla symbolu *${symbol}*)`)
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

  message.channel.send({ embed });
  message.channel.stopTyping();
}
