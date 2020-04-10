import request from 'request-promise-native';
import { DevBuild } from '.';

export default async function getDevBuildBranch(branch: string): Promise<DevBuild> {
  const url = `https://bitrise-redirector.herokuapp.com/v0.1/apps/daeff1893f3c8128/builds/${branch}/artifacts/0/info`;
  const options = {
    method: 'GET',
    uri: url,
    json: true,
  };

  const response = await request(options);

  return {
    branch,
    url: response.public_install_page_url || url,
    version: response.build_number,
    publishedAt: response.finished_at,
  };
}
