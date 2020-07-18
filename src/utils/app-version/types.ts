export type BetaBuild = {
  url: string;
  directUrl: string | null;
  version: string;
  publishedAt: string;
};

export type DevBuild = {
  branch: string;
  url: string;
  version: number;
  publishedAt: string;
  redirect: false;
};

export type DevBuildRedirect = {
  branch: string;
  redirectUrl: string;
  redirect: true;
};
