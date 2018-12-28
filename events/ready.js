const Discord = require("discord.js");
const uonetStatus = require("../utils/uonetStatus");

var statusChannels = [];
var lastStatusCode = 0;

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

    var statusCode = (studentNewStatus.code * 3) + (studentOldStatus.code);

    if(statusCode !== lastStatusCode) {
      var statusColor = Math.max(studentNewStatus.code, studentOldStatus.code) === uonetStatus.STATUS_WORKING ?
        "2ecc71" : 
        "f1c40f";

      var studentNewMessage = "";

      if (studentNewStatus.code === uonetStatus.STATUS_WORKING)
        studentNewMessage = "Wszystko powinno działać poprawnie";
      else if (studentNewStatus.code === uonetStatus.STATUS_ERROR)
        studentNewMessage = studentNewStatus.message ?
          `Błąd: \`${studentNewStatus.message}\`` :
          `Błąd sprawdzania statusu`;
      else if (studentNewStatus.code === uonetStatus.STATUS_TECHNICAL_BREAK) {
        studentNewMessage = "Przerwa techniczna"
      }

      var studentOldMessage = "";

      if (studentOldStatus.code === uonetStatus.STATUS_WORKING)
        studentOldMessage = "Wszystko powinno działać poprawnie";
      else if (studentOldStatus.code === uonetStatus.STATUS_ERROR)
        studentOldMessage = studentOldStatus.message ?
          `Błąd: \`${studentOldStatus.message}\`` :
          `Błąd sprawdzania statusu`;
      else if (studentOldStatus.code === uonetStatus.STATUS_TECHNICAL_BREAK) {
        studentOldMessage = "Przerwa techniczna"
      }

      const embed = new Discord.RichEmbed()
        .setTitle("Status dzienniczka się zmienił!")
        .setColor(statusColor)
        .addField("Nowy moduł uczeń:", studentNewMessage)
        .addField("Stary moduł uczeń:", studentOldMessage);
      statusChannels.forEach((statusChannel) => {
        statusChannel.send({embed});
      });
    }

    lastStatusCode = statusCode;
  }, interval);

  console.log(`Uruchomiono bota :)`);
}
