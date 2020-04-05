const FuzzySet = require('fuzzyset.js');

module.exports = function commandHandler(client, message) {
  if (message.content.indexOf(client.config.prefix) === 0) {
    if (message.channel.name !== client.config.channels.bot) return false;

    const args = message.content.slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const commandName = args.shift()
      .toLowerCase();
    const cmd = client.commands.get(commandName);

    if (cmd) {
      cmd.run(client, message, args);
    } else {
      const commandsFuzzySet = new FuzzySet(Array.from(client.commands.keys()));
      const match = commandsFuzzySet.get(commandName, null, 0.5);
      message.channel.send(`Nie ma takiej komendy \`${client.config.prefix}${commandName}\`\n${match ? `Czy chodziło ci o \`${client.config.prefix}${match[0][1]}\`?\n` : ''}W celu uzyskania pomocy wpisz \`!pomoc\``);
    }

    return true;
  }

  return false;
};
