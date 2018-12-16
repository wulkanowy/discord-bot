const https = require("https");

module.exports.getBetaBuild = function () {
  return new Promise((resolve, reject) => {
    https.get("https://api.github.com/repos/wulkanowy/wulkanowy/releases/latest", {headers: {'User-Agent': 'Mozilla/5.0'}}, function(res) {
      var body = '';
      
      let error;
      if (res.statusCode !== 200) {
        error = new Error(`Request Failed. Status Code: ${res.statusCode}`);
      } else if (!/^application\/json/.test(res.headers['content-type'])) {
        error = new Error(`Invalid content-type. Expected application/json but received ${res.headers['content-type']}`);
      }

      if (error) {
        reject(error);
        res.resume();
        return;
      }

      res.on('data', function(chunk){
        body += chunk;
      });
      
      res.on('end', function(){
        try {
          var response = JSON.parse(body);
          console.log("Response: ", response);
          resolve ({
            url: response.html_url,
            directUrl: response.assets[0].browser_download_url,
            version: response.tag_name
          });
        }
        catch (error) {
          console.log(body);
          reject(error);
          return;
        }
      });
    }).on('error', function(error){
      reject(error);
      return;
    });
  });
}