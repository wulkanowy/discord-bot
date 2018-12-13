const getTitleAtUrl = require('get-title-at-url');
exports.run = (client, message, args) => {
  getTitleAtUrl("https://uonetplus-uczen.vulcan.net.pl/", function(title){
    if (title === "Przerwa techniczna"){
      message.channel.send(`Dzienniczek Vulcan przeszedł na "przerwę techniczną", czyli tak naprawdę ma awarię. Więc aplikacja też.`);
    }
    else {
      message.channel.send("Dziennik działa poprawnie", {
        files: ['https://i.imgur.com/FcPd2Nf.png']
      });
      laststatus = true;
    }
  });
}