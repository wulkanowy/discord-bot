exports.run = (client, message, args) => {
  if(!message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", false)){
    message.channel.send("Nie masz permisji!")
    return;
  }
  if(!args || args.size < 1) return message.reply("Podaj nazwe komendy!");
  const commandName = args[0];
  if(!client.commands.has(commandName)) {
    return message.reply("Ta komenda nie istnieje!");
  }
  delete require.cache[require.resolve(`./${commandName}.js`)];
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  message.reply(`Komenda ${commandName} została ponownie załadowana.`);
};