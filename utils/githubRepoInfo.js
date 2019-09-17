const https = require('https');

module.exports.getRepoInfo = (owner, repo) => new Promise((resolve, reject) => {
  https.get(
    `https://api.github.com/repos/${owner}/${repo}${
      process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
    }`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } },
    (res) => {
      let body = '';

      try {
        if (res.statusCode === 404) {
          resolve(null);
          res.resume();
          return;
        } if (res.statusCode !== 200) {
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
            avatar: response.owner.avatar_url,
            url: response.html_url,
            description: response.description,
            stars: response.stargazers_count,
            name: response.full_name,
            homepage: response.homepage || null,
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

const getWulkanowyPullInfo = number => new Promise((resolve, reject) => {
  https.get(
    `https://api.github.com/repos/wulkanowy/wulkanowy/pulls/${number}${
      process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
    }`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } },
    (res) => {
      let body = '';

      try {
        if (res.statusCode === 404) {
          resolve(null);
          res.resume();
          return;
        } if (res.statusCode !== 200) {
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
            number,
            user: {
              login: response.user.login,
              avatar: response.user.avatar_url,
              url: response.user.html_url,
            },
            url: response.html_url,
            title: response.title,
            description: response.body,
            merged: response.merged || false,
            draft: response.mergeable_state === 'draft' || false,
            state: response.state,
            type: 'pull',
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

module.exports.getWulkanowyIssueInfo = number => new Promise((resolve, reject) => {
  https.get(
    `https://api.github.com/repos/wulkanowy/wulkanowy/issues/${number}${
      process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
    }`,
    { headers: { 'User-Agent': 'Mozilla/5.0' } },
    (res) => {
      let body = '';

      try {
        if (res.statusCode === 404) {
          resolve(null);
          res.resume();
          return;
        } if (res.statusCode !== 200) {
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

          if (response.pull_request) {
            getWulkanowyPullInfo(number)
              .then(resolve)
              .catch(reject);
            return;
          }

          resolve({
            number,
            user: {
              login: response.user.login,
              avatar: response.user.avatar_url,
              url: response.user.html_url,
            },
            url: response.html_url,
            title: response.title,
            description: response.body,
            state: response.state,
            type: 'issue',
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
