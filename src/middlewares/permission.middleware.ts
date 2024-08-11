import { AuthFacade } from '@/facades/auth.facade';
import { PermissionManager, PermissionModel, PermissionVerb } from '@/services/permissions.service';
import prisma from '@/services/prisma.service';
import HttpStatusCode from '@/utils/HTTPStatusCodes';
import { ResponseHandler } from '@/utils/responseHandler';
import { logger } from '@/utils/winston';
import { NextFunction, Request, Response } from 'express';

export function checkPermission(model: PermissionModel, ...actions: PermissionVerb[]) {
  return async (_: Request, res: Response, next: NextFunction) => {
    try {
      const permissionManager = new PermissionManager();
      const authBody = AuthFacade.get();

      if (!authBody) {
        const resBody = ResponseHandler.Unauthorized('Unauthenticated');
        res.status(resBody.error!.code).json(resBody);
      } else {
        const user = await prisma.user.findUnique({
          where: { id: authBody.userId },
          include: {
            role: {
              include: { permission: true },
            },
          },
        });

        if (!user) {
          res.status(HttpStatusCode.UNAUTHORIZED).json(ResponseHandler.NotFound('User not found'));
        } else {
          if (user.role.permission) {
            const hasPermission = permissionManager.canPerform(
              user.role.permission?.name,
              model,
              actions
            );
            if (hasPermission) {
              next();
            } else {
              res
                .status(HttpStatusCode.FORBIDDEN)
                .json(ResponseHandler.Forbidden('Permission denied'));
            }
          } else {
            next();
          }
        }
      }
    } catch (error) {
      logger.error({ 'Error checking permission:': error });
      res
        .status(500)
        .json(
          ResponseHandler.response('Internal Server Error', HttpStatusCode.INTERNAL_SERVER_ERROR)
        );
    }
  };
}
