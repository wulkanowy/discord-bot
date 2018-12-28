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
    .setTitle("Status dzienniczka")
    .setColor(statusColor)
    .addField("Nowy moduł uczeń:", studentNewMessage)
    .addField("Stary moduł uczeń:", studentOldMessage);
  message.channel.send({embed});
  message.channel.stopTyping();
}
