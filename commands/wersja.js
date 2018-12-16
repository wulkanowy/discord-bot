const Discord = require("discord.js");
const appVersion = require("../utils/appVersion");

exports.run = async (client, message, args) => {
  try {
    var beta = await appVersion.getBetaBuild();
    var dev = await appVersion.getDevBuild();
  }
  catch (error) {
    message.channel.send(`Błąd: \`${error.message}\``);
  }
  
  var embed = new Discord.RichEmbed()
    .setAuthor("Najnowsze wersje Wulkanowego", "https://doteq.pinglimited.me/515xf8.png")
    .setColor("F44336")
    .addField("Wersja beta", `**v${beta.version}** opublikowana **${new Date(beta.publishedAt).toLocaleString("pl-PL", {
      timeZone: "Europe/Warsaw",
      hour12: false
    })}** `)
    .addField("Wersja DEV", `**${dev.version}** opublikowana **${new Date(dev.publishedAt).toLocaleString("pl-PL", {
      timeZone: "Europe/Warsaw",
      hour12: false
    })}** `)
  message.channel.send({embed});
}
