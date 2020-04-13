import request from 'request-promise-native';
import { DevBuild, DevBuildRedirect, getDevBuildBranch } from '.';

export default async function getDevBranchBuilds(): Promise<Array<DevBuild | DevBuildRedirect>> {
  const url = `https://api.github.com/repos/wulkanowy/wulkanowy/branches${
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

  const branchNames = response.map((branch: { name: string }) => branch.name);
  return Promise.all(branchNames.map((e: string) => getDevBuildBranch(e)));
}
