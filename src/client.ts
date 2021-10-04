import Discord from 'discord.js';
import { BotConfig } from './types';

export default class Client extends Discord.Client {
  public readonly config: BotConfig;

  constructor(config: BotConfig) {
    super({ intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
      Discord.Intents.FLAGS.DIRECT_MESSAGES] });
    this.config = config;
  }
}
