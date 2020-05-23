import FuzzySet from 'fuzzyset.js';
import Discord from 'discord.js';
import Client from '../client';
import commands from '../commands';

export default function commandHandler(client: Client, message: Discord.Message): boolean {
  if (message.content.startsWith(client.config.prefix)) {
    if (
      message.channel instanceof Discord.DMChannel
      || message.channel.name !== client.config.channels.bot
    ) {
      return false;
    }

    const args = message.content.slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return false;
    const cmd = commands.get(commandName);

    if (cmd) {
      cmd(client, message, args);
    } else {
      const commandsFuzzySet = FuzzySet(Array.from(commands.keys()));
      const match = commandsFuzzySet.get(commandName, null, 0.5);
      message.channel.send(`Nie ma takiej komendy \`${client.config.prefix}${commandName}\`\n${match ? `Czy chodziło ci o \`${client.config.prefix}${match[0][1]}\`?\n` : ''}W celu uzyskania pomocy wpisz \`${client.config.prefix}pomoc\``);
    }

    return true;
  }

  return false;
}
