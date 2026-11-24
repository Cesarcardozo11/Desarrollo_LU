import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

// Guard = un "portero" que decide si se puede abrir una ruta.
// CanActivateFn = el tipo de guard que se ejecuta ANTES de entrar a la ruta.
// Si devuelve true → deja pasar. Si devuelve false → no deja entrar.
// Se usa en app.routes.ts con: canActivate: [authGuard]
export const authGuard: CanActivateFn = () => {
  // inject() = pedirle a Angular el servicio de sesión y el router
  const authService = inject(AuthService);
  const router = inject(Router);

  // ¿Hay sesión? → puede pasar
  if (authService.isLoggedIn()) {
    return true;
  }

  // No hay sesión → lo mandamos al login y no lo dejamos entrar
  router.navigate(['/login']);
  return false;
};
