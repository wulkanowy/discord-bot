var Discord = require("discord.js");
module.exports = (client) => {
  client.guilds.forEach(guild => {
    console.log(`Dostępny na ${guild.name}`);
    const channel = guild.channels.find(ch => ch.name === client.config.channels.bot);
    if (!channel) return;
    const embed = new Discord.RichEmbed()
      .setAuthor("Witam, jestem!", "https://doteq.pinglimited.me/515xf8.png")
      .setColor("F44336");
    channel.send({embed});
  });
  console.log(`Uruchomiono bota :)`);
}