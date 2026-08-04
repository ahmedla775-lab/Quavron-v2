import WorkspaceModel from "./WorkspaceModel";
import { resolveWorkspace } from "./WorkspaceResolver";

export function createWorkspace(config) {

  const model = new WorkspaceModel(config);

  return resolveWorkspace(model);

}
