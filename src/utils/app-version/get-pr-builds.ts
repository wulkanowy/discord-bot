import got from 'got';
import { DevBuild, DevBuildRedirect, getDevBuildBranch } from '.';

export default async function getPrBuilds(): Promise<Array<DevBuild | DevBuildRedirect>> {
  const url = 'https://api.github.com/repos/wulkanowy/wulkanowy/pulls';

  const response = await got<{
    head: {
      ref: string;
    };
  }[]>(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Authorization: process.env.API_GITHUB_TOKEN ? `token ${process.env.API_GITHUB_TOKEN}` : undefined,
    },
    responseType: 'json',
  });

  const branchNames = response.body.map((pull) => pull.head.ref);
  return Promise.all(branchNames.map(getDevBuildBranch));
}
