const FuzzySet = require('fuzzyset.js');

module.exports = (client, message) => {
  if (message.author.bot) return;
  if (message.content.indexOf(client.config.prefix) !== 0) return;
  if (message.channel.name !== client.config.channels.bot) return;

  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command);

  if (!cmd) {
    const commandsFuzzySet = new FuzzySet(Array.from(client.commands.keys()));
    const match = commandsFuzzySet.get(command, null, 0.5);
    message.channel.send(`Nie ma takiej komendy \`${client.config.prefix}${command}\`\n${match ? `Czy chodziło ci o \`${client.config.prefix}${match[0][1]}\`? *(podobieństwo **${Math.round(match[0][0] * 1000) / 10}%**)*\n` : ''}W celu uzyskania pomocy wpisz \`!pomoc\``);
    return;
  }

  cmd.run(client, message, args);
};
