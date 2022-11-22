import got from 'got';
import { IssueInfo, PullInfo, getPullInfo } from '.';

export default async function getIssueInfo(
  owner: string,
  repo: string,
  number: number,
): Promise<IssueInfo | PullInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}`;

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
      state: 'open' | 'closed';
      pull_request?: {
        url: string;
      };
    }>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Authorization: process.env.API_GITHUB_TOKEN ? `token ${process.env.API_GITHUB_TOKEN}` : undefined,
      },
      responseType: 'json',
    });

    if ('pull_request' in response.body) {
      return await getPullInfo(owner, repo, number);
    }

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
      open: response.body.state === 'open',
      owner,
      repo,
      type: 'issue',
    };
  } catch (error) {
    if (error instanceof got.HTTPError && error.response.statusCode === 404) return null;
    throw error;
  }
}
