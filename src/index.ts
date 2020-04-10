import fs from 'fs';
import path from 'path';
import Client from './client';
import guildMemberAddHandler from './event-handlers/guild-member-add';
import messageHandler from './event-handlers/message';
import readyHandler from './event-handlers/ready';

if (!process.env.DISCORD_TOKEN) {
  throw new Error('Token not provided');
}

let client: Client;

fs.promises.readFile(path.join(__dirname, '../config.json'), 'utf8')
  .then((data: string) => {
    client = new Client(JSON.parse(data));

    client.on('guildMemberAdd', guildMemberAddHandler.bind(null, client));
    client.on('message', messageHandler.bind(null, client));
    client.on('ready', readyHandler.bind(null, client));

    client.login(process.env.DISCORD_TOKEN);
  })
  .catch((error: Error) => {
    console.error('Podczas wczytywania plików konfiguracyjnych wystąpił błąd');
    console.error(error);
    process.exit(1);
  });