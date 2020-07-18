import got from 'got';
import { BetaBuild } from '.';

export default async function getBetaBuild(): Promise<BetaBuild> {
  const url = `https://api.github.com/repos/wulkanowy/wulkanowy/releases/latest${
    process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
  }`;

  const response = await got<{
    html_url: string;
    assets: {
      browser_download_url: string;
    }[];
    tag_name: string;
    published_at: string;
  }>(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    responseType: 'json',
  });

  return {
    url: response.body.html_url,
    directUrl: response.body.assets[0]?.browser_download_url ?? null,
    version: response.body.tag_name,
    publishedAt: response.body.published_at,
  };
}
