const http = require('https');

exports.run = (client, message) => {
  const usrmessage = message;
  const code = message.content.slice(2, -2);
  const options = {
    method: 'POST',
    hostname: 'hastebin.cf',
    path: '/documents',
  };

  const req = http.request(options, (res) => {
    const chunks = [];

    res.on('data', (chunk) => {
      chunks.push(chunk);
    });

    res.on('end', () => {
      const body = JSON.parse(Buffer.concat(chunks).toString());
      message.delete()
        .then(() => message.channel.send({
          embed: {
            color: 11062,
            author: {
              name: usrmessage.author.username,
              icon_url: usrmessage.author.displayAvatarURL,
            },
            title: `hastebin.cf/${body.key}`,
            url: `https://hastebin.cf/${body.key}`,
          },
        }));
    });
  });
  req.write(code);
  req.end();
};
