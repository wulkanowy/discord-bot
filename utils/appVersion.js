const https = require('https');

module.exports.getBetaBuild = () => new Promise((resolve, reject) => {
  https.get('https://api.github.com/repos/wulkanowy/wulkanowy/releases/latest', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let body = '';

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

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(body);
        resolve({
          url: response.html_url,
          directUrl: response.assets[0].browser_download_url,
          version: response.tag_name,
          publishedAt: response.published_at,
        });
      } catch (error) {
        console.log(body);
        reject(error);
      }
    });
  }).on('error', (error) => {
    reject(error);
  });
});

module.exports.getDevBuild = () => new Promise((resolve, reject) => {
  https.get('https://bitrise-redirector.herokuapp.com/v0.1/apps/daeff1893f3c8128/builds/master/artifacts/0/info', (res) => {
    let body = '';

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

    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(body);
        resolve({
          url: response.public_install_page_url,
          directUrl: response.expiring_download_url,
          version: response.build_number,
          publishedAt: response.finished_at,
        });
      } catch (error) {
        console.log(body);
        reject(error);
      }
    });
  }).on('error', (error) => {
    reject(error);
  });
});
