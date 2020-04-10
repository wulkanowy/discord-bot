import request from 'request-promise-native';
import { BetaBuild } from '.';

export default async function getBetaBuild(): Promise<BetaBuild> {
  const url = `https://api.github.com/repos/wulkanowy/wulkanowy/releases/latest${
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

  const response = await request(options);

  return {
    url: response.html_url,
    directUrl: response.assets[0]?.browser_download_url || null,
    version: response.tag_name,
    publishedAt: response.published_at,
  };
}
