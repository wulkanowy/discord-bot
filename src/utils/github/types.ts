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
