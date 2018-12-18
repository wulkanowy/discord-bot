const Discord = require("discord.js");
const uonetStatus = require("../utils/uonetStatus");

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  try {
    var studentNewStatus = await uonetStatus.studentNew();
    var studentOldStatus = await uonetStatus.studentOld();
  }
  catch (error) {
    message.channel.send(`Błąd: \`${error.message}\``);
    message.channel.stopTyping();
    return;
  }

  var statusCode = (studentNewStatus?2:0) + (studentOldStatus?1:0);

  var statusColor = (statusCode === 3) ? ("2ecc71") : ( (statusCode === 0) ? ("e74c3c") : ("f1c40f") );

  const embed = new Discord.RichEmbed()
    .setTitle("Status dzienniczka")
    .setColor(statusColor)
    .addField("Nowy moduł uczeń:", studentNewStatus?"Wszystko powinno działać poprawnie":"Awaria")
    .addField("Stary moduł uczeń:", studentOldStatus?"Wszystko powinno działać poprawnie":"Awaria");
  message.channel.send({embed});
  message.channel.stopTyping();
}
