import Discord from 'discord.js';
import Client from '../client';

export default async function guildMemberAddHandler(
  client: Client,
  partialMember: Discord.PartialGuildMember | Discord.GuildMember,
): Promise<void> {
  const member = await partialMember.fetch();
  console.log(`${member.user.username} wbił!`);
  const avatar = member.user.avatarURL();
  const { id } = member.user;
  const embedDM = new Discord.MessageEmbed()
    .setTitle('Witaj na serwerze Wulkanowego!')
    .setDescription('Używamy tutaj specjalnych ról, by móc oznaczyć osoby korzystające z danej wersji e-dziennika (np. `vulcan.net.pl`, `eszkola.opolskie.pl`).\nUłatwia to rozwiązywanie problemów i testowanie nowych funkcji.\n\nBy wyświetlić listę wszystkich ról, przejdź na kanał #choose-role\n - By przydzielić sobie odpowienią rolę, kliknij w odpowiednią reakcję.\n\n**Dziękujemy za wybranie naszej aplikacji!**')
    .setColor('F44336');
  await member.send({ embed: embedDM });

  const channel = member.guild.channels.cache.find(
    (ch: Discord.GuildChannel) => ch.name === client.config.channels.greetings,
  );
  if (!channel || !(channel instanceof Discord.TextChannel)) return;
  const embedPublic = new Discord.MessageEmbed()
    .setAuthor('Na serwerze pojawił się', avatar || undefined)
    .setDescription(`<@!${id}>`)
    .setColor('F44336');
  await channel.send({ embed: embedPublic });
}
