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
