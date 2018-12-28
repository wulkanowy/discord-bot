exports.run = (client, message, args) => {
  function displayHelp(channel) {
    var helpString = [
      "**Lista dostępnych komend:**",
      ...help.map(e => `\`!${e.command}\`: ${e.text}`)
    ].join("\n");
    channel.send(helpString);
  }

  function parseCommand(message) {
    var messageMatch = message.trim(message).match(/^!\w{1,}.{0,}/g);
    if (messageMatch) {
      var messageArray = messageMatch[0].split(" ");
      return {
        command: messageArray[0].substring(1).toLowerCase(),
        args: messageArray.slice(1)
      };
    } else {
      return null;
    }
  }

  var help = [
    {
      command: "pomoc",
      text: "Wyświetla pomoc (to)."
    },
    {
      command: "rola dodaj <nazwa_roli>",
      text: "Dodaje rolę użytkownikowi."
    },
    {
      command: "rola usun <nazwa_roli>",
      text: "Usuwa rolę użytkownikowi."
    },
    {
      command: "pobierz",
      text: "Daje link do pobrania aplikacji."
    }
  ];
  displayHelp(message.channel);
};
