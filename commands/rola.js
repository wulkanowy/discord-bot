exports.run = (client, message, args) => {
  if (args[0]) {
    if (args[0].toLowerCase() === 'dodaj' && args[1]) {
      let found = false;
      const { roles } = client.config;
      for (let i = 0; i < roles.length && !found; i++) {
        if (roles[i] === args[1].toLowerCase()) {
          found = true;
          const role = message.guild.roles.cache.find((r) => r.name === roles[i]);

          if (!role) {
            message.channel.send('Błąd: `Nie znaleziono roli na serwerze`');
            return;
          }

          message.member.roles.add(role)
            .then(() => {
              message.channel.send(`Nadano rolę ${role.name}`);
            })
            .catch((error) => {
              console.warn(error);
              message.channel.send(`Błąd:\n\`\`\`\n${error.message}\n\`\`\``);
            });
        }
      }

      if (!found) {
        message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${client.config.roles.map((e) => `\`${e}\``).join(', ')}`);
      }
    } else if (args[0].toLowerCase() === 'usun' && args[1]) {
      let found = false;
      const { roles } = client.config;
      for (let i = 0; i < roles.length && !found; i++) {
        console.log(roles[i]);
        if (roles[i] === args[1].toLowerCase()) {
          found = true;

          const role = message.guild.roles.cache.find((r) => r.name === roles[i]);

          if (!role) {
            message.channel.send('Błąd: `Nie znaleziono roli na serwerze`');
            return;
          }


          message.member.roles.remove(role)
            .then(() => {
              message.channel.send(`Odebrano rolę ${role.name}`);
            })
            .catch((error) => {
              console.warn(error);
              message.channel.send(`Błąd:\n\`\`\`\n${error.message}\n\`\`\``);
            });
        }
      }

      if (!found) {
        message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${client.config.roles.map((e) => `\`${e}\``).join(', ')}`);
      }
    } else if (args[0].toLowerCase() === 'lista') {
      message.channel.send(`Dostępne role: ${client.config.roles.map((e) => `\`${e}\``).join(', ')}`);
    } else {
      message.channel.send('Użycie: `!rola <dodaj|usun> <nazwa_roli>` lub `!rola lista`');
    }
  } else {
    message.channel.send('Użycie: `!rola <dodaj|usun> <nazwa_roli>` lub `!rola lista`');
  }
};
