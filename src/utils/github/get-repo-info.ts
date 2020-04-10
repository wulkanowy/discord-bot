import request from 'request-promise-native';
import { RepoInfo } from '.';

export default async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}${
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
      avatar: response.owner.avatar_url,
      url: response.html_url,
      description: response.description,
      stars: response.stargazers_count,
      name: response.full_name,
      homepage: response.homepage || null,
    };
  } catch (error) {
    if (error.response.statusCode === 404) return null;
    throw error;
  }
}
