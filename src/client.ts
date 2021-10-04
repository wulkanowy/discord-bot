import Discord from 'discord.js';
import { BotConfig } from './types';

export default class Client extends Discord.Client {
  public readonly config: BotConfig;

  constructor(config: BotConfig) {
    super({
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
      ],
    });
    this.config = config;
  }
}
