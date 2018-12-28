exports.run = (client, message, args) => {
  if (args[1] && (args[0].toLowerCase() === "dodaj" || args[0].toLowerCase() === "usun")) {
    if (args[0] === "dodaj") {
      var found = false;
      var roles = client.config.roles;
      for (i = 0; i < roles.length && !found; i++) {
        console.log(roles[i]);
        if (roles[i] === args[1].toLowerCase()) {
          found = true;
          let role = message.guild.roles.find(r => r.name === roles[i]);
          message.member.addRole(role)
            .then(() => {
              message.channel.send(`Nadano rolę ${role.name}`);
            })
            .catch((error) => {
              console.warn(error);
              message.channel.send("Błąd:\n```\n" + error.message + "\n```");
            });
        }
      }

      if (!found) {
        message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${client.config.roles.map(e => `\`${e}\``).join(", ")}`);
      }
    } else if (args[0] === "usun") {
      var found = false;
      var roles = client.config.roles;
      for (i = 0; i < roles.length && !found; i++) {
        console.log(roles[i]);
        if (roles[i] === args[1].toLowerCase()) {
          found = true;
          let role = message.guild.roles.find(r => r.name === roles[i]);
          message.member.removeRole(role)
            .then(() => {
              message.channel.send(`Odebrano rolę ${role.name}`);
            })
            .catch((error) => {
              console.warn(error);
              message.channel.send("Błąd:\n```\n" + error.message + "\n```");
            });
        }
      }

      if (!found) {
        message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${client.config.roles.map(e => `\`${e}\``).join(", ")}`);
      }
    }
  } else {
    message.channel.send("Użycie: `!rola <dodaj|usun> <nazwa_roli>`");
  }
};
