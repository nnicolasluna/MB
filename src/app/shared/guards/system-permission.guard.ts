import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { permissionTypes } from '@shared/interfaces';
import { PermissionsService } from '@shared/services';

export const systemPermissionGuard: CanActivateChildFn = (childRoute, _state) => {
	const permissionService = inject(PermissionsService);
	const router = inject(Router);

	const resourceName = childRoute?.data?.['moduleCode'];
	const verifyPermission: permissionTypes = childRoute?.data?.['permission'];

	if (!resourceName) return true;

	const permission = permissionService.handleAccess(resourceName, verifyPermission, false);
	if (permission) return true;

	router.navigate(['/home']);
	return false;
};
