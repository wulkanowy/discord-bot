import got from 'got';
import { DevBuild, DevBuildRedirect } from '.';

export default async function getDevBuildBranch(
  branch: string,
): Promise<DevBuild | DevBuildRedirect> {
  try {
    const url = `https://bitrise-redirector.herokuapp.com/v0.1/apps/daeff1893f3c8128/builds/${branch}/artifacts/0/info`;

    const response = await got<{
      build_number: number;
      public_install_page_url: string;
      finished_at: string;
    }>(url, {
      responseType: 'json',
    });

    return {
      branch,
      url: response.body.public_install_page_url,
      version: response.body.build_number,
      publishedAt: response.body.finished_at,
      redirect: false,
    };
  } catch (error) {
    if (error instanceof got.HTTPError && error.response.statusCode === 404) {
      return {
        branch,
        redirectUrl: `https://bitrise-redirector.herokuapp.com/v0.1/apps/daeff1893f3c8128/builds/${branch}/artifacts/0`,
        redirect: true,
      };
    }
    throw error;
  }
}
