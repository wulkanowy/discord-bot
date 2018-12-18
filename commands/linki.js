const Discord = require("discord.js");

exports.run = (client, message, args) => {
  var embed = new Discord.RichEmbed()
    .setAuthor("Linki", "https://doteq.pinglimited.me/515xf8.png")
    .setColor("F44336")
    .addField("Strona", "https://wulkanowy.github.io/")
    .addField("GitHub", "https://github.com/wulkanowy/")
    .addField("Sklep Play", "https://play.google.com/store/apps/details?id=io.github.wulkanowy&hl=pl")
    .addField("Trello", "https://trello.com/b/A97NUM1s/wulkanowy/");
  message.channel.send({embed})
}
