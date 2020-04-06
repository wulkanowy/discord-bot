import request from 'request-promise';

export type BetaBuild = {
  url: string;
  directUrl: string | null;
  version: string;
  publishedAt: string;
};

export type DevBuild = {
  branch: string;
  url: string;
  version: string;
  publishedAt: string;
};

export async function getBetaBuild(): Promise<BetaBuild> {
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

export async function getDevBuildBranch(branch: string): Promise<DevBuild> {
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

export async function getDevBranchBuilds(): Promise<DevBuild[]> {
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

export async function getPrBuilds(): Promise<DevBuild[]> {
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

export function getDevelopBuild(): Promise<DevBuild> {
  return getDevBuildBranch('develop');
}
