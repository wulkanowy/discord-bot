import got from 'got';
import { RepoInfo } from '.';

export default async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}${
    process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
  }`;

  try {
    const response = await got<{
      owner: {
        avatar_url: string;
      };
      html_url: string;
      description: string;
      stargazers_count: number;
      full_name: string;
      homepage?: string;
    }>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      responseType: 'json',
    });
    return {
      avatar: response.body.owner.avatar_url,
      url: response.body.html_url,
      description: response.body.description,
      stars: response.body.stargazers_count,
      name: response.body.full_name,
      homepage: response.body.homepage || null,
    };
  } catch (error) {
    if (error instanceof got.HTTPError && error.response.statusCode === 404) return null;
    throw error;
  }
}
