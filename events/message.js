module.exports = (client, message) => {
    if (message.author.bot) return;
    if (message.content.indexOf(client.config.prefix) !== 0) return;
    if (message.channel.name !== client.config.channels.bot) return;

    var args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    var command = args.shift().toLowerCase();
    var cmd = client.commands.get(command);

    if (!cmd) {
      message.channel.send(`Nie ma takiej komendy \`!${command}\`\nW celu uzyskania pomocy wpisz \`!pomoc\``);
      return;
    }
    
    cmd.run(client, message, args);
  };