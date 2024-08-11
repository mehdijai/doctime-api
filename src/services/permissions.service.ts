export enum PermissionRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}
export enum PermissionModel {
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export enum PermissionVerb {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}

export type PermissionPayload = Partial<Record<PermissionModel, PermissionVerb[]>>;

export class PermissionManager {
  private permissions: PermissionPayload = {};

  canPerform(permissionString: string, model: PermissionModel, actions: PermissionVerb[]) {
    this.permissions = this.parse(permissionString);
    if (!this.permissions) {
      return false;
    }
    if (!this.permissions[model]) {
      return false;
    }
    return actions.some((action) => this.permissions[model]?.includes(action));
  }

  getRolePermissions() {
    return this.permissions || {};
  }

  addPermission(model: PermissionModel, action: PermissionVerb) {
    if (!this.permissions) {
      this.permissions = {};
    }
    if (!this.permissions[model]) {
      this.permissions[model] = [];
    }
    if (!this.permissions[model].includes(action)) {
      this.permissions[model].push(action);
    }
  }

  removePermission(model: PermissionModel, action: PermissionVerb) {
    if (this.permissions && this.permissions[model]) {
      const index = this.permissions[model].indexOf(action);
      if (index !== -1) {
        this.permissions[model].splice(index, 1);
      }
    }
  }

  stringify(object: PermissionPayload): string {
    return JSON.stringify(object);
  }

  parse(string: string): PermissionPayload {
    return JSON.parse(string) as PermissionPayload;
  }
}
