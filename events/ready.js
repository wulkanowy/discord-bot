const getTitleAtUrl = require('get-title-at-url');
var Discord = require("discord.js");
var schannel;
var laststatus = 3;
module.exports = (client) => {
  client.guilds.forEach(guild => {
    console.log(`Dostępny na ${guild.name}`);
    var channel = guild.channels.find(ch => ch.name === client.config.channels.bot);
    schannel = guild.channels.find(ch => ch.name === client.config.channels.status);
    if (!schannel) return;
    if (!channel) return;
    var embed = new Discord.RichEmbed()
      .setAuthor("Witam, jestem!", "https://doteq.pinglimited.me/515xf8.png")
      .setColor("F44336");
    channel.send({embed})
      .then((message) => {
        message.delete(30000)
      .catch((error) => {});
    });
  });

  var minutes = 1, interval = minutes * 60 * 1000;
  
  setInterval(function() {
    getTitleAtUrl("https://uonetplus-uczen.vulcan.net.pl/", function(title) {
      if (title === "Przerwa techniczna") {
        nowy = false;
      }
      else {
			  nowy = true;
		  }
    });

    getTitleAtUrl("https://uonetplus-opiekun.vulcan.net.pl/", function(title) {
      if (title === "Przerwa techniczna") {
        stary = false;
      }
      else {
        stary = true;
      }
    });

    schannel.startTyping();

    setTimeout(function() {
    	schannel.stopTyping();

      if(nowy && stary && laststatus != 3) {
	      const embed = new Discord.RichEmbed()
          .setTitle("Status się zmienił!")
          .setColor("2ecc71")
          .addField("Nowy moduł uczeń:", "Wszystko powinno działać poprawnie.")
          .addField("Stary moduł uczeń:", "Wszystko powinno działać poprawnie.");
        schannel.send({embed});
        laststatus = 3;
      }
      else if(nowy && !stary && laststatus != 2) {
        const embed = new Discord.RichEmbed()
          .setTitle("Status się zmienił!")
          .setColor("f1c40f")
          .addField("Nowy moduł uczeń:", "Wszystko powinno działać poprawnie.")
          .addField("Stary moduł uczeń:", "Awaria");
        schannel.send({embed});
        laststatus = 2;
      }
      else if(!nowy && stary && laststatus != 1) {
        const embed = new Discord.RichEmbed()
          .setTitle("Status się zmienił!")
          .setColor("f1c40f")
          .addField("Nowy moduł uczeń:", "Awaria")
          .addField("Stary moduł uczeń:", "Wszystko powinno działać poprawnie.");
        schannel.send({embed});
        laststatus = 1;
      }
      else if(!nowy && !stary && laststatus != 0){
        const embed = new Discord.RichEmbed()
          .setTitle("Status się zmienił!")
          .setColor("e74c3c")
          .addField("Nowy moduł uczeń:", "Awaria")
          .addField("Stary moduł uczeń:", "Awaria");
        schannel.send({embed});
        laststatus = 0;
      }
      else return;
    }, 5000);
  }, interval);

  console.log(`Uruchomiono bota :)`);
}
