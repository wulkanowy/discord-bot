exports.run = (client, message, args) => {
  if(args[0]) {
    if(args[0].toLowerCase() === "dodaj" && args[1]) {
      var found = false;
      var roles = client.config.roles;
      for(i = 0; i < roles.length && !found; i++) {
        console.log(roles[i]);
        if(roles[i] === args[1].toLowerCase()) {
          found = true;
          let role = message.guild.roles.find(r => r.name === roles[i]);

          if(!role) {
            message.channel.send("Błąd:\n```\nNie znaleziono roli na serwerze\n```");
            return;
          }

          message.member.addRole(role)
          .then(() => {
            message.channel.send(`Nadano rolę ${role.name}`);
          })
          .catch((error) => {
            console.warn(error);
            message.channel.send("Błąd:\n```\n"+error.message+"\n```");
          });
        }
      }

      if(!found) {
        message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${client.config.roles.map(e => `\`${e}\``).join(", ")}`);
      }
    }
    else if(args[0].toLowerCase() === "usun" && args[1]) {
      var found = false;
      var roles = client.config.roles;
      for(i = 0; i < roles.length && !found; i++) {
        console.log(roles[i]);
        if(roles[i] === args[1].toLowerCase()) {
          found = true;
          let role = message.guild.roles.find(r => r.name === roles[i]);

          if(!role) {
            message.channel.send("Błąd:\n```\nNie znaleziono roli na serwerze\n```");
            return;
          }

          message.member.removeRole(role)
          .then(() => {
            message.channel.send(`Odebrano rolę ${role.name}`);
          })
          .catch((error) => {
            console.warn(error);
            message.channel.send("Błąd:\n```\n"+error.message+"\n```");
          });
        }
      }

      if(!found) {
        message.channel.send(`Nieznana rola \`${args[1].toLowerCase()}\`\nDostępne role: ${client.config.roles.map(e => `\`${e}\``).join(", ")}`);
      }
    }
    else if(args[0].toLowerCase() === "lista") {
      message.channel.send(`Dostępne role: ${client.config.roles.map(e => `\`${e}\``).join(", ")}`);
    }
    else {
      message.channel.send("Użycie: `!rola <dodaj|usun> <nazwa_roli>` lub `!rola lista`");
    }
  }
  else {
    message.channel.send("Użycie: `!rola <dodaj|usun> <nazwa_roli>` lub `!rola lista`");
  }
}