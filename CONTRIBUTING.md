# Contributing to Discord Bot

The following is a set of guidelines for contributing to Discord Bot repo.

## Table of contents

- [How can you contribute?](#how-can-you-contribute)
- [Styleguides](#styleguides)
- [Running the bot locally](#running-the-bot-locally)
- [How does the bot work?](#how-does-the-bot-work)

## How can you contribute?

### Reporting bugs and sharing your ideas

You have an idea or you have found a bug in the bot. The simplest way to share it is via the [Wulkanowy Discord server](https://discord.gg/vccAQBr) (yes, the server that this bot is made for). You can also [file an issue](https://github.com/wulkanowy/discord-bot/issues) on GitHub. Just make sure it's not already on the list.

### Contributing code

First create a fork of the [wulkanowy/discord-bot](https://github.com/wulkanowy/discord-bot). If you are just getting started please see [How does the bot work](#how-does-the-bot-work). This will give you basic understanding of the code of the bot. To test the bot locally see [Running the bot locally](#running-the-bot-locally).
When pushing commits and creating pull requests please follow the [Styleguides](#styleguides).

Please also use lint to make sure the code is correctly formatted:
```shell
npm run lint
```

## Styleguides

### Git commit messages

- Use the present tense. (`Use toilet paper` not `Used toilet paper`)
- Use the imperative mood. (`Flush the toilet` not `Flushes the toilet`)
- Use this format in pull request merge commits: `Name (#Pull)`. (example: `Wash hands (#16)`)

## Running the bot locally

To run the bot on your machine first install all the required dependencies using:
```shell
$ npm install
```

Then you will have to set up a bot on [Discord Developers Portal](https://discordapp.com/developers) and add it on your Discord server.

After that copy the bot token form the bot settings and set it as the `DiscordToken` environmental variable.

To run the bot use:
```shell
$ npm start
```

## How does the bot work?

Work In Progress
