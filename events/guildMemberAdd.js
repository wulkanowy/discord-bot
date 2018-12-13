var Discord = require("discord.js");
module.exports = (client, member) => {
  console.log(`${member.user.username} wbił!`);
  var avatar = member.user.displayAvatarURL;
  var id = member.user.id;
  const embedDM = new Discord.RichEmbed()
    .setTitle(`Witamy na serwerze`)
    .setDescription("Aby skorzystać z bota wpisz `!pomoc` na kanale #bot\nAby dostać rolę wpisz `!rola dodaj <nazwa>`\nAby uzyskać listę ról wpisz `!rola lista`")
    .setColor("F44336");
  member.send({embed: embedDM});

  const channel = member.guild.channels.find(ch => ch.name === client.config.channels.greetings);
  if (!channel) return;
  const embedPublic = new Discord.RichEmbed()
    .setAuthor(`Na serwerze pojawił się`, avatar)
    .setDescription(`<@${id}>`)
    .setColor("F44336");
  channel.send({embed: embedPublic});
}