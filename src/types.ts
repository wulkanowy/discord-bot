import Discord from 'discord.js';
import Client from './client';

export interface BotConfig {
  channels: {
    bot: string;
    status: string;
    greetings: string;
  };
  statusInterval: number;
  prefix: string;
  roles: string[];
}

export type Command = ((client: Client, message: Discord.Message) => Promise<void>) |
((client: Client, message: Discord.Message, args: string[]) => Promise<void>);
