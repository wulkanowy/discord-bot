import got from 'got';
import {DevBuild, DevBuildRedirect} from '.';

export default async function getDevBuildBranch(
  branch: string,
): Promise<DevBuild | DevBuildRedirect> {
  try {
    const url = `https://manager.wulkanowy.net.pl/v1/build/app/daeff1893f3c8128/branch/${branch}`;

    const response = await got<{
      data: {
        build_number: number;
        build_slug: string;
        artifact_url: string;
        finished_at: string;
      }
    }>(url, {
      responseType: 'json',
    });

    return {
      branch,
      url: `https://manager.wulkanowy.net.pl/v1/download/app/daeff1893f3c8128/build/${response.body.data.build_slug}/artifact/${response.body.data.artifact_url}`,
      version: response.body.data.build_number,
      publishedAt: response.body.data.finished_at,
      redirect: false,
    };
  } catch (error) {
    if (error instanceof got.HTTPError && error.response.statusCode === 404) {
      return {
        branch,
        redirectUrl: `https://manager.wulkanowy.net.pl/v1/download/app/daeff1893f3c8128/branch/${branch}`,
        redirect: true,
      };
    }
    throw error;
  }
}
