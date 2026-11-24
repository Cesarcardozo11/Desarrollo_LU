import { Routes } from '@angular/router';
import { Clientes } from './View/clientes/clientes';
import { Compras } from './View/compras/compras';
import { Inventario } from './View/inventario/inventario';
import { Form } from './Components/form/form';
import { Login } from './Components/login/login';
import { authGuard } from './guards/auth.guard';

// Routes = la lista de rutas: qué página (componente) se abre en cada URL.
// path = la URL | component = el componente que se muestra
// canActivate = el guard que revisa si se puede entrar (aquí: si hay sesión)
export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'Clientes', component: Clientes, canActivate: [authGuard] },

  // redirectTo = si la URL está vacía (''), manda a /login.
  // pathMatch: 'full' = la URL tiene que ser exactamente '' (no solo empezar así)
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'Compras', component: Compras, canActivate: [authGuard] },
  { path: 'Inventario', component: Inventario, canActivate: [authGuard] },
  { path: 'form', component: Form, canActivate: [authGuard] },
];
