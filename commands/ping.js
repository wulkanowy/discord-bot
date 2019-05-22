const Discord = require('discord.js');

exports.run = (client, message) => {
  const embed = new Discord.RichEmbed()
    .setTitle('PONG! :ping_pong:')
    .setColor('F44336');
  message.channel.send({ embed });
};
