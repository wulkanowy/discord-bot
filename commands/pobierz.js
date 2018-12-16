var Discord = require("discord.js");
exports.run = (client, message, args) => {
  var embed = new Discord.RichEmbed()
      .setAuthor("Pobierz Wulkanowy!", "https://doteq.pinglimited.me/515xf8.png")
      .setColor("F44336")
      .addField("Google Play:", "https://play.google.com/store/apps/details?id=io.github.wulkanowy")
      .addField("Wersję beta/dev pobierzesz na:", "https://wulkanowy.github.io/");
  message.channel.send({embed});
}
