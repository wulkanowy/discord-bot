const getTitleAtUrl = require('get-title-at-url');
var Discord = require("discord.js");
var stary;
var nowy;
exports.run = (client, message, args) => {
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
console.log("nie dziala")
          }
          else{
			  stary = true;
			  console.log("Dziennik dziala");
		  }
});

message.channel.startTyping();
    .then((message) => {
      message.delete(5000)
      .catch((error) => {});
    });

setTimeout(function() {
	message.channel.stopTyping();

if(nowy && stary){
	const embed = new Discord.RichEmbed()
      .setTitle("Status dziennika")
      .setColor("2ecc71")
      .addField("Nowy moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
      .addField("Stary moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
  message.channel.send({embed});
}
else if(nowy && !stary) {
	const embed = new Discord.RichEmbed()
      .setTitle("Status dziennika")
      .setColor("f1c40f")
      .addField("Nowy moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
      .addField("Stary moduł uczeń:",
          "Awaria")
  message.channel.send({embed});
}
else if(!nowy && stary){
	const embed = new Discord.RichEmbed()
      .setTitle("Status dziennika")
      .setColor("f1c40f")
      .addField("Nowy moduł uczeń:",
          "Awaria")
      .addField("Stary moduł uczeń:",
          "Wszystko powinno działać poprawnie.")
  message.channel.send({embed});
}
else{
	console.log(nowy + stary)
	const embed = new Discord.RichEmbed()
      .setTitle("Status dziennika")
      .setColor("e74c3c")
      .addField("Nowy moduł uczeń:",
          "Awaria")
      .addField("Stary moduł uczeń:",
          "Awaria")
  message.channel.send({embed});
}
}, 5000);
}
