import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenuComponent } from './Components/menu/menu.component';
import { AuthService } from './Services/auth.service';

@Component({
  imports: [MenuComponent, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  public authService = inject(AuthService);
  private router = inject(Router);
  protected readonly title = signal('Lulosa');

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
