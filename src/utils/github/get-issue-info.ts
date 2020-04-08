import request from 'request-promise-native';
import { IssueInfo, PullInfo, getPullInfo } from '.';

export default async function getIssueInfo(
  owner: string,
  repo: string,
  number: number,
): Promise<IssueInfo | PullInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}${
    process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
  }`;

  const options = {
    method: 'GET',
    uri: url,
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    json: true,
  };

  try {
    const response = await request(options);
    if (response.pull_request) {
      return getPullInfo(owner, repo, number);
    }

    return {
      number,
      user: {
        login: response.user.login,
        avatar: response.user.avatar_url,
        url: response.user.html_url,
      },
      url: response.html_url,
      title: response.title,
      description: response.body,
      open: response.state === 'open',
      owner,
      repo,
      type: 'issue',
    };
  } catch (error) {
    if (error.response.statusCode === 404) return null;
    throw error;
  }
}
