import got from 'got';
import { DevBuild, DevBuildRedirect, getDevBuildBranch } from '.';

export default async function getDevBranchBuilds(): Promise<Array<DevBuild | DevBuildRedirect>> {
  const url = 'https://api.github.com/repos/wulkanowy/wulkanowy/branches';

  const response = await got<{
    name: string;
  }[]>(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Authorization: process.env.API_GITHUB_TOKEN ? `token ${process.env.API_GITHUB_TOKEN}` : undefined,
    },
    responseType: 'json',
  });

  const branchNames = response.body.map((branch: { name: string }) => branch.name);
  return Promise.all(branchNames.map((e: string) => getDevBuildBranch(e)));
}
