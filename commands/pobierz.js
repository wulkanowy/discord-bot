exports.run = (client, message) => {
  message.channel.send({
    embed: {
      color: 3447003,
      description: 'Najnowszą wersję aplikacji zainstalujesz z: https://wulkanowy.github.io',
    },
  });
};
