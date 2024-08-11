import prisma from '@/services/prisma.service';
import { PermissionRole, PermissionVerb } from '@/services/permissions.service';
import { PermissionPayload } from '@/services/permissions.service';

export async function seedPermissions() {
  const permissions: Record<PermissionRole, PermissionPayload> = {
    admin: {
      patient: [
        PermissionVerb.CREATE,
        PermissionVerb.READ,
        PermissionVerb.UPDATE,
        PermissionVerb.DELETE,
      ],
      doctor: [
        PermissionVerb.CREATE,
        PermissionVerb.READ,
        PermissionVerb.UPDATE,
        PermissionVerb.DELETE,
      ],
    },
    patient: {
      patient: [
        PermissionVerb.CREATE,
        PermissionVerb.READ,
        PermissionVerb.UPDATE,
        PermissionVerb.DELETE,
      ],
      doctor: [PermissionVerb.READ],
    },
    doctor: {
      patient: [PermissionVerb.READ],
      doctor: [
        PermissionVerb.CREATE,
        PermissionVerb.READ,
        PermissionVerb.UPDATE,
        PermissionVerb.DELETE,
      ],
    },
  };

  for (const roleName of Object.values(PermissionRole)) {
    const role = await prisma.role.create({
      data: {
        name: roleName,
      },
    });

    await prisma.permission.create({
      data: {
        name: JSON.stringify(permissions[roleName]),
        roles: {
          connect: {
            id: role.id,
          },
        },
      },
    });
  }
}
