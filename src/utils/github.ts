import request from 'request-promise-native';

export type RepoInfo = {
  avatar: string;
  url: string;
  description: string;
  stars: number;
  name: string;
  homepage: string | null;
};

export type PullInfo = {
  number: number;
  user: {
    login: string;
    avatar: string;
    url: string;
  };
  url: string;
  title: string;
  description: string;
  merged: boolean;
  draft: boolean;
  open: boolean;
  type: 'pull';
};

export type IssueInfo = {
  number: number;
  user: {
    login: string;
    avatar: string;
    url: string;
  };
  url: string;
  title: string;
  description: string;
  open: boolean;
  owner: string;
  repo: string;
  type: 'issue';
};

export async function getRepoInfo(owner: string, repo: string): Promise<RepoInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}${
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

  try {
    const response = await request(options);
    return {
      avatar: response.owner.avatar_url,
      url: response.html_url,
      description: response.description,
      stars: response.stargazers_count,
      name: response.full_name,
      homepage: response.homepage || null,
    };
  } catch (error) {
    if (error.response.statusCode === 404) return null;
    throw error;
  }
}

async function getPullInfo(owner: string, repo: string, number: number): Promise<PullInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${number}${
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

  try {
    const response = await request(options);
    return {
      number,
      user: {
        login: response.user.login,
        avatar: response.user.avatar_url,
        url: response.user.html_url,
      },
      url: response.html_url,
      title: response.title,
      description: response.body,
      merged: response.merged || false,
      draft: response.mergeable_state === 'draft' || false,
      open: response.state === 'open',
      type: 'pull',
    };
  } catch (error) {
    if (error.response.statusCode === 404) return null;
    throw error;
  }
}

export async function getIssueInfo(
  owner: string,
  repo: string,
  number: number,
): Promise<IssueInfo | PullInfo | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${number}${
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

  try {
    const response = await request(options);
    if (response.pull_request) {
      return getPullInfo(owner, repo, number);
    }

    return {
      number,
      user: {
        login: response.user.login,
        avatar: response.user.avatar_url,
        url: response.user.html_url,
      },
      url: response.html_url,
      title: response.title,
      description: response.body,
      open: response.state === 'open',
      owner,
      repo,
      type: 'issue',
    };
  } catch (error) {
    if (error.response.statusCode === 404) return null;
    throw error;
  }
}
