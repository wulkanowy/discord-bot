import { DevBuild, DevBuildRedirect, getDevBuildBranch } from '.';

export default function getDevelopBuild(): Promise<DevBuild | DevBuildRedirect> {
  return getDevBuildBranch('develop');
}
