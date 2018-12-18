const getTitleAtUrl = require('get-title-at-url');
var Discord = require("discord.js");
module.exports = (client) => {
  client.guilds.forEach(guild => {
    console.log(`Dostępny na ${guild.name}`);
    var channel = guild.channels.find(ch => ch.name === client.config.channels.status);
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

    var laststatus = 0;
  var minutes = 1, interval = minutes * 60 * 1000;
  
  setInterval(function() {
getTitleAtUrl("https://uonetplus-uczen.vulcan.net.pl/", function(title){
          if (title === "Przerwa techniczna"){
nowy = false;
          }
          else{
			  nowy = true;
		  }
});
getTitleAtUrl("https://uonetplus-opiekun.vulcan.net.pl/", function(title){
          if (title === "Przerwa techniczna"){
stary = false;
          }
          else{
			  stary = true;
		  }
});

channel.send("Sprawdzam... (To potrwa 5 sekund)")
    .then((message) => {
      message.delete(5000)
      .catch((error) => {});
    });

setTimeout(function() {

if(nowy && stary && laststatus != 3){
	const embed = new Discord.RichEmbed()
      .setTitle("Status się zmienił!")
      .setColor("2ecc71")
      .addField("Nowy moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
      .addField("Stary moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
      .setFooter("Wygenerowano przez Wulkanowy Bot", "https://doteq.pinglimited.me/515xf8.png");
channel.send({embed});
    laststatus = 3;
}
else if(nowy && !stary && laststatus != 2) {
	const embed = new Discord.RichEmbed()
      .setTitle("Status się zmienił!")
      .setColor("f1c40f")
      .addField("Nowy moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
      .addField("Stary moduł uczeń:",
          "Awaria")
      .setFooter("Wygenerowano przez Wulkanowy Bot", "https://doteq.pinglimited.me/515xf8.png");
channel.send({embed});
    laststatus = 2;
}
else if(!nowy && stary && laststatus != 1){
	const embed = new Discord.RichEmbed()
      .setTitle("Status się zmienił!")
      .setColor("f1c40f")
      .addField("Nowy moduł uczeń:",
          "Awaria")
      .addField("Stary moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
      .setFooter("Wygenerowano przez Wulkanowy Bot", "https://doteq.pinglimited.me/515xf8.png");
channel.send({embed});
    laststatus = 1;
}
else if(laststatus != 0){
	const embed = new Discord.RichEmbed()
      .setTitle("Status się zmienił!")
      .setColor("e74c3c")
      .addField("Nowy moduł uczeń:",
          "Awaria")
      .addField("Stary moduł uczeń:",
          "Awaria")
      .setFooter("Wygenerowano przez Wulkanowy Bot", "https://doteq.pinglimited.me/515xf8.png");
channel.send({embed});
  laststatus = 0;
}
}, 5000);
}, interval);

  console.log(`Uruchomiono bota :)`);
}
