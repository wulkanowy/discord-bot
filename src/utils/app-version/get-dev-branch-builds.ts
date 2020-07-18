import got from 'got';
import { DevBuild, DevBuildRedirect, getDevBuildBranch } from '.';

export default async function getDevBranchBuilds(): Promise<Array<DevBuild | DevBuildRedirect>> {
  const url = `https://api.github.com/repos/wulkanowy/wulkanowy/branches${
    process.env.GITHUB_API_TOKEN ? `?access_token=${process.env.GITHUB_API_TOKEN}` : ''
  }`;

  const response = await got<{
    name: string;
  }[]>(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
    responseType: 'json',
  });

  const branchNames = response.body.map((branch: { name: string }) => branch.name);
  return Promise.all(branchNames.map((e: string) => getDevBuildBranch(e)));
}
