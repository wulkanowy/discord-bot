const https = require('https');

module.exports.getBetaBuild = () => new Promise((resolve, reject) => {
  https.get(
    `https://api.github.com/repos/wulkanowy/wulkanowy/releases/latest${
      process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
    }`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } },
    (res) => {
      let body = '';

      try {
        if (res.statusCode !== 200) {
          throw new Error(`Request Failed. Status Code: ${res.statusCode}`);
        } else if (!/^application\/json/.test(res.headers['content-type'])) {
          throw new Error(`Invalid content-type. Expected application/json but received ${res.headers['content-type']}`);
        }
      } catch (error) {
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
    },
  ).on('error', (error) => {
    reject(error);
  });
});

module.exports.getDevBranchBuilds = () => new Promise((resolve, reject) => {
  https.get(
    `https://api.github.com/repos/wulkanowy/wulkanowy/branches${
      process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
    }`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } },
    (res) => {
      let body = '';

      try {
        if (res.statusCode !== 200) {
          reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
          return;
        } if (!/^application\/json/.test(res.headers['content-type'])) {
          throw new Error(`Invalid content-type. Expected application/json but received ${res.headers['content-type']}`);
        }
      } catch (error) {
        reject(error);
        res.resume();
        return;
      }

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', async () => {
        let response;
        try {
          response = JSON.parse(body);
        } catch (error) {
          console.log(body);
          reject(error);
          return;
        }

        const branches = response.map(e => e.name);
        const branchBuildPromises = branches.map(
          e => module.exports.getDevBuildBranch(e)
            .catch(error => error),
        );
        const branchBuilds = await Promise.all(branchBuildPromises);

        resolve(branchBuilds);
      });
    },
  ).on('error', (error) => {
    reject(error);
  });
});

module.exports.getDevPrBuilds = () => new Promise((resolve, reject) => {
  https.get(
    `https://api.github.com/repos/wulkanowy/wulkanowy/pulls${
      process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
    }`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } },
    (res) => {
      let body = '';

      try {
        if (res.statusCode !== 200) {
          reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
          return;
        } if (!/^application\/json/.test(res.headers['content-type'])) {
          throw new Error(`Invalid content-type. Expected application/json but received ${res.headers['content-type']}`);
        }
      } catch (error) {
        reject(error);
        res.resume();
        return;
      }

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', async () => {
        let response;
        try {
          response = JSON.parse(body);
        } catch (error) {
          console.log(body);
          reject(error);
          return;
        }

        const branchBuilds = await Promise.all(response
          .map(e => e.head.ref)
          .map(e => module.exports.getDevBuildBranch(e).catch(error => error)));

        resolve(branchBuilds);
      });
    },
  ).on('error', (error) => {
    reject(error);
  });
});

module.exports.getDevBuildBranch = branch => new Promise((resolve, reject) => {
  const url = `https://bitrise-redirector.herokuapp.com/v0.1/apps/f841f20d8f8b1dc8/builds/${branch}/artifacts/0/info`;

  https.get(url, (res) => {
    if (!/^application\/json/.test(res.headers['content-type'])) {
      reject(new Error(`Invalid content-type. Expected application/json but received ${res.headers['content-type']}`));
      res.resume();
      return;
    }

    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(body);
        resolve({
          branch,
          url: response.public_install_page_url || url,
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

module.exports.getDevMasterBuild = () => module.exports.getDevBuildBranch('master');
