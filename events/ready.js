module.exports = (client) => {
  client.guilds.forEach(guild => {
    console.log(`Dostępny na ${guild.name}`);
    const channel = guild.channels.find(ch => ch.name === client.config.channel);
    if (!channel) return;
    channel.send('Witam, jestem!');
  });
  console.log(`Uruchomiono bota :)`);
}