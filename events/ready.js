const getTitleAtUrl = require('get-title-at-url');
var Discord = require("discord.js");
module.exports = (client) => {
  client.guilds.forEach(guild => {
    console.log(`Dostępny na ${guild.name}`);
    var channel = guild.channels.find(ch => ch.name === client.config.channels.bot);
    if (!channel) return;
    var embed = new Discord.RichEmbed()
      .setAuthor("Witam, jestem!", "https://doteq.pinglimited.me/515xf8.png")
      .setColor("F44336");
    channel.send({embed})
    .then((message) => {
      setTimeout(() => {
        message.delete();
      }, 30000);
    });
  });

  var laststatus = true;
  var minutes = 1, interval = minutes * 60 * 1000;
  setInterval(function() {
    getTitleAtUrl("https://uonetplus-uczen.vulcan.net.pl/", function(title) {
      if (title === "Przerwa techniczna" && laststatus == true) {
        client.guilds.forEach(guild => {
          var channel = guild.channels.find(ch => ch.name === client.config.channels.bot);
          if (!channel) return;
          channel.send(`Dzienniczek Vulcan przeszedł na "przerwę techniczną", czyli tak naprawdę ma awarię. Więc aplikacja też.`);
        });
        laststatus = false;
      }
      else if(laststatus == false) {
        client.guilds.forEach(guild => {
          var channel = guild.channels.find(ch => ch.name === client.config.channels.bot);
          channel.send("Dziennik działa poprawnie", {
            files: ['https://i.imgur.com/FcPd2Nf.png']
          });
        });
        laststatus = true;
      }
      else return;
  }, interval)});
  
  console.log(`Uruchomiono bota :)`);
}
