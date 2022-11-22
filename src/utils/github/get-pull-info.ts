import got from 'got';
import { PullInfo } from '.';

export default async function getPullInfo(
  owner: string,
  repo: string,
  number: number,
): Promise<PullInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}`;

  try {
    const response = await got<{
      user: {
        login: string;
        avatar_url: string;
        html_url: string;
      };
      html_url: string;
      title: string;
      body: string;
      merged: boolean;
      draft: boolean;
      state: 'open' | 'closed';
    }>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Authorization: process.env.API_GITHUB_TOKEN ? `token ${process.env.API_GITHUB_TOKEN}` : undefined,
      },
      responseType: 'json',
    });

    return {
      number,
      user: {
        login: response.body.user.login,
        avatar: response.body.user.avatar_url,
        url: response.body.user.html_url,
      },
      url: response.body.html_url,
      title: response.body.title,
      description: response.body.body,
      merged: response.body.merged,
      draft: response.body.draft,
      open: response.body.state === 'open',
      type: 'pull',
    };
  } catch (error) {
    if (error instanceof got.HTTPError && error.response.statusCode === 404) return null;
    throw error;
  }
}
