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

      res.on('data', function(chunk) {
        body += chunk;
      });
      
      res.on('end', function(){
        try {
          var response = JSON.parse(body);
          resolve ({
            url: response.html_url,
            directUrl: response.assets[0].browser_download_url,
            version: response.tag_name,
            publishedAt: response.published_at
          });
        }
        catch (error) {
          console.log(body);
          reject(error);
          return;
        }
      });
    }).on('error', function(error) {
      reject(error);
      return;
    });
  });
}

module.exports.getDevBuild = function () {
  return new Promise((resolve, reject) => {
    https.get("https://bitrise-redirector.herokuapp.com/v0.1/apps/daeff1893f3c8128/builds/master/artifacts/0/info", function(res) {
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

      res.on('data', function(chunk) {
        body += chunk;
      });
      
      res.on('end', function() {
        try {
          var response = JSON.parse(body);
          resolve ({
            url: response.public_install_page_url,
            directUrl: response.expiring_download_url,
            version: response.build_number,
            publishedAt: response.finished_at
          });
        }
        catch (error) {
          console.log(body);
          reject(error);
          return;
        }
      });
    }).on('error', function(error) {
      reject(error);
      return;
    });
  });
}
