import request from 'request-promise-native';
import { PullInfo } from '.';

export default async function getPullInfo(
  owner: string,
  repo: string,
  number: number,
): Promise<PullInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}${
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
      merged: response.merged || false,
      draft: response.mergeable_state === 'draft' || false,
      open: response.state === 'open',
      type: 'pull',
    };
  } catch (error) {
    if (error.response.statusCode === 404) return null;
    throw error;
  }
}
