import Discord from 'discord.js';
import { BotConfig } from './types';

export default class Client extends Discord.Client {
  public readonly config: BotConfig;

  constructor(config: BotConfig) {
    super();
    this.config = config;
  }

  // public commands: Map<
  // string,
  // ((client: Client, message: Discord.Message) => Promise<void>)
  // | ((client: Client, message: Discord.Message, args: string[]) => Promise<void>)
  // >;
}
