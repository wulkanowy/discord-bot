const Discord = require('discord.js');

module.exports = (client, member) => {
  console.log(`${member.user.username} wbił!`);
  const avatar = member.user.displayAvatarURL;
  const { id } = member.user;
  const embedDM = new Discord.RichEmbed()
    .setTitle('Witaj na serwerze Wulkanowego!')
    .setDescription('Używamy tutaj specjalych ról, by móc oznaczyć osoby korzystające z danej wersji e-dziennika (np. `vulcan.net.pl`, `eszkola.opolskie.pl`).\nUłatwia to rozwiązywanie problemów i testowanie nowych funkcji.\n\n**UWAGA**: Wszystkie komendy wpisuje się na kanale `#bot`\n\n - By wyświetlić listę wszystkich ról, wpisz ```!rola lista```\n - By przydzielić sobie odpowienią rolę, na kanale #bot wpisz ```!rola dodaj <nazwa_roli>```Na przykład\n```!rola dodaj vulcan.net.pl```\n - By wyświetlić listę wszystkich komend obsługiwanych przez naszego bota, wpisz ```!pomoc```\n\n**Dziękujemy za wybranie naszej aplikacji!**')
    .setColor('F44336');
  member.send({ embed: embedDM });

  const channel = member.guild.channels.find(ch => ch.name === client.config.channels.greetings);
  if (!channel) return;
  const embedPublic = new Discord.RichEmbed()
    .setAuthor('Na serwerze pojawił się', avatar)
    .setDescription(`<@${id}>`)
    .setColor('F44336');
  channel.send({ embed: embedPublic });
};
