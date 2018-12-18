const Discord = require("discord.js");
const uonetStatus = require("../utils/uonetStatus");

var statusChannels = [];
var lastStatusCode = 3;
module.exports = (client) => {
  client.guilds.forEach(guild => {
    console.log(`Dostępny na ${guild.name}`);
    var channel = guild.channels.find(ch => ch.name === client.config.channels.bot);
    statusChannels.push(guild.channels.find(ch => ch.name === client.config.channels.status));
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

  var interval = client.config.statusInterval * 1000;
  
  setInterval(async function() {
    try {
      var studentNewStatus = await uonetStatus.studentNew();
      var studentOldStatus = await uonetStatus.studentOld();
    }
    catch (error) {
      statusChannels.forEach((statusChannel) => {
        statusChannel.channel.send(`Błąd: \`${error.message}\``);
        return;
      });
    }

    var statusCode = (studentNewStatus?2:0) + (studentOldStatus?1:0);

    var statusColor = (statusCode === 3) ? ("2ecc71") : ( (statusCode === 0) ? ("e74c3c") : ("f1c40f") );

    if(statusCode !== lastStatusCode) {
      const embed = new Discord.RichEmbed()
        .setTitle("Status się zmienił!")
        .setColor(statusColor)
        .addField("Nowy moduł uczeń:", studentNewStatus?"Wszystko powinno działać poprawnie":"Awaria")
        .addField("Stary moduł uczeń:", studentOldStatus?"Wszystko powinno działać poprawnie":"Awaria");
      statusChannels.forEach((statusChannel) => {
        statusChannel.send({embed});
      });
    }

    lastStatusCode = statusCode;
  }, interval);

  console.log(`Uruchomiono bota :)`);
}
