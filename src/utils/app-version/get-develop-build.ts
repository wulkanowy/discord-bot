import { DevBuild, getDevBuildBranch } from '.';

export default function getDevelopBuild(): Promise<DevBuild> {
  return getDevBuildBranch('develop');
}
