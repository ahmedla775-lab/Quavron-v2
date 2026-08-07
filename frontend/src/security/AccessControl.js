import { ROLE_PERMISSIONS } from "../constants/rolePermissions";

export function can(profile, permission) {

  if (!profile) return false;

  const role =
    profile.role || "individual";

  const permissions =
    ROLE_PERMISSIONS[role] ||
    ROLE_PERMISSIONS.individual;

  return Boolean(
    permissions[permission]
  );
}


export function canAny(profile, permissions = []) {

  return permissions.some(
    (permission) =>
      can(profile, permission)
  );

}


export function canAll(profile, permissions = []) {

  return permissions.every(
    (permission) =>
      can(profile, permission)
  );

}
