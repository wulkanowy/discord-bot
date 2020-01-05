const http = require('https');
exports.run = (client, message) => {
    var usrmessage = message
    var code = message.content.slice(2, -2)
    var options = {
        "method": "POST",
        "hostname": "hastebin.cf",
        "path": "/documents"
    };

    var req = http.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on("end", function() {
            var body = JSON.parse(Buffer.concat(chunks).toString());
            message.delete()
                .then(msg => message.channel.send({
                    embed: {
                        color: 11062,
                        author: {
                            name: usrmessage.author.username,
                            icon_url: usrmessage.author.displayAvatarURL
                        },
                        title: "hastebin.cf/" + body.key,
                        url: "https://hastebin.cf/" + body.key
                    }
                }));
        });
    })
    req.write(code);
    req.end();
}
