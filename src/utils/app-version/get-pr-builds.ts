import request from 'request-promise-native';
import { DevBuild, getDevBuildBranch } from '.';

export default async function getPrBuilds(): Promise<DevBuild[]> {
  const url = `https://api.github.com/repos/wulkanowy/wulkanowy/pulls${
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

  const branchNames = response.map((pull: { head: { ref: string } }) => pull.head.ref);
  return Promise.all(branchNames.map((e: string) => getDevBuildBranch(e)));
}
