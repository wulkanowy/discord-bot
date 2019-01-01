const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const config = require('./config.json');

const client = new Discord.Client();

client.config = config;

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    const event = require(`./events/${file}`);
    const eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Enmap();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach((file) => {
    if (!file.endsWith('.js')) return;
    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    console.log(`Ladowanie komendy ${commandName}`);
    client.commands.set(commandName, props);
  });
});

if (!process.env.DISCORD_TOKEN) {
  throw new Error('Token not provided');
}
client.login(process.env.DISCORD_TOKEN);
