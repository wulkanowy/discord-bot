const Discord = require("discord.js");
const appVersion = require("../utils/appVersion");

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  try {
    var beta = await appVersion.getBetaBuild();
    var dev = await appVersion.getDevBuild();
  }
  catch (error) {
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  var embed = new Discord.RichEmbed()
    .setAuthor("Pobierz Wulkanowy!", "https://doteq.pinglimited.me/515xf8.png")
    .setColor("F44336")
    .addField("Strona internetowa", "https://wulkanowy.github.io/")
    .addField("Wersja beta",
      `Aktualna wersja: **v${beta.version}** opublikowana **${new Date(beta.publishedAt).toLocaleString("pl-PL", {
        timeZone: "Europe/Warsaw",
        hour12: false
      })}**\n\n` +
      "Sklep Play: https://play.google.com/store/apps/details?id=io.github.wulkanowy\n" +
      `GitHub: ${beta.url}\n` +
      `Direct: ${beta.directUrl}`
    )
    .addField("Wersja DEV",
    `Aktualna wersja: **v${dev.version}** opublikowana **${new Date(dev.publishedAt).toLocaleString("pl-PL", {
      timeZone: "Europe/Warsaw",
      hour12: false
    })}**\n\n` +
    `Bitrise: ${dev.url}\n`
    );
  message.channel.send({embed});
  message.channel.stopTyping();
}
