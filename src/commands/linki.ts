import Discord from 'discord.js';
import Client from '../client';

export default async function linki(client: Client, message: Discord.Message): Promise<void> {
  const embed = new Discord.MessageEmbed()
    .setAuthor('Linki', 'https://cdn.discordapp.com/attachments/523847362632744975/546459616188563477/nr_logo_wulkanowy2.png')
    .addField('Strona', 'https://wulkanowy.github.io/')
    .addField('GitHub', 'https://github.com/wulkanowy/')
    .addField('Sklep Play', 'https://play.google.com/store/apps/details?id=io.github.wulkanowy&hl=pl')
    .addField('Trello', 'https://trello.com/b/A97NUM1s/wulkanowy/')
    .addField('PayPal', 'https://www.paypal.me/wulkanowy')
    .addField('Pomoc w tłumaczeniu', 'https://crowdin.com/project/wulkanowy')
    .setColor('F44336');
  await message.channel.send({ embed });
}
