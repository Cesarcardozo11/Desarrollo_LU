import { Component, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenuComponent } from './Components/menu/menu.component';
import { AuthService } from './Services/auth.service';

// @Component = decorador (etiqueta con @) que le dice a Angular: "esta clase es un componente".
// Un componente = una pieza de pantalla con su lógica (.ts), su HTML y su CSS.
@Component({
  // imports = lo que este componente usa en su HTML (el menú y el router-outlet)
  imports: [MenuComponent, RouterOutlet],
  // selector = el nombre de su etiqueta HTML: <app-root> (está en index.html)
  selector: 'app-root',
  // styleUrl / templateUrl = dónde están su CSS y su HTML
  styleUrl: './app.css',
  templateUrl: './app.html',
})
// export class = la clase del componente; "export" permite usarla en otros archivos
export class App {
  // inject() = pedirle a Angular un servicio ya creado (inyección de dependencias).
  // public = se puede usar desde el HTML
  public authService = inject(AuthService);
  // private = solo se usa dentro de esta clase
  private router = inject(Router);

  // Devuelve true si la URL actual es /login
  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
