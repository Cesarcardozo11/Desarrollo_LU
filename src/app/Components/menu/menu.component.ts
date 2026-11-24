import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { map } from 'rxjs/operators';
import { RouterOutlet, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

// Menú lateral de la app (Angular Material)
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  imports: [
    MatButtonModule, // botones de Material
    MatSidenavModule, // el panel lateral
    MatIconModule, // los íconos
    RouterOutlet, // el hueco donde se dibuja cada página
    RouterLink, // enlaces que cambian de página sin recargar
    RouterLinkActive, // resalta el enlace de la página abierta
    NgOptimizedImage, // carga optimizada del logo
  ],
})
export class MenuComponent {
  // BreakpointObserver = detecta el tamaño de la pantalla (celular o computador)
  private readonly breakpointObserver = inject(BreakpointObserver);

  // isHandset = true si la pantalla es de celular.
  // observe(...) devuelve un Observable; pipe + map deja solo true/false;
  // toSignal = convierte ese Observable en un signal para usarlo fácil en el HTML.
  readonly isHandset = toSignal(
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  private authService = inject(AuthService);
  private router = inject(Router);

  // Cerrar sesión: borra la sesión y navega al login.
  // router.navigate = cambiar de página desde el código
  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
