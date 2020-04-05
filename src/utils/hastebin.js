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

    try {
      if (res.statusCode === 404) {
        res.resume();
        return;
      } if (res.statusCode !== 200) {
        throw new Error(`Request Failed. Status Code: ${res.statusCode}`);
      } else if (!/^application\/json/.test(res.headers['content-type'])) {
        throw new Error(`Invalid content-type. Expected application/json but received ${res.headers['content-type']}`);
      }
    } catch (error) {
      res.resume();
      return;
    }

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
