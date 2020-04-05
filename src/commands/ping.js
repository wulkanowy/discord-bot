const Discord = require('discord.js');

exports.run = async (client, message) => {
  const testmessage = await message.channel.send('Sprawdzam...');
  const embed = new Discord.MessageEmbed()
    .setTitle('PONG! :ping_pong:')
    .setDescription(
      `${`Udało mi się odpowiedzieć w **${Math.round(testmessage.createdTimestamp - message.createdTimestamp)}ms`}\n**`
      + `${`Opóźnienie API Discord wynosi **${Math.round(client.ws.ping)}ms**`}`,
    )
    .setColor('F44336');
  testmessage.edit({ embed });
};
