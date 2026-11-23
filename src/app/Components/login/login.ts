import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Qué apartado se muestra: el de iniciar sesión o el de registrarse
  modo = signal<'login' | 'registro'>('login');

  // Mientras se espera la respuesta del backend se desactiva el botón
  cargando = signal(false);

  // Formulario reactivo para iniciar sesión
  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  // Formulario reactivo para registrarse
  registroForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  // Cambia entre "Iniciar sesión" y "Registrarse"
  cambiarModo(): void {
    this.modo.set(this.modo() === 'login' ? 'registro' : 'login');
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (response) => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${response.user?.nombre}!`,
          timer: 1500,
          showConfirmButton: false,
        }).then(() => this.router.navigate(['/Clientes']));
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError('No se pudo iniciar sesión', error);
      },
    });
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.authService.registrar(this.registroForm.getRawValue()).subscribe({
      next: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'Ya puedes iniciar sesión con tu email y contraseña.',
        });
        // Se pasa al login con el email ya escrito
        this.loginForm.reset({ email: this.registroForm.getRawValue().email, password: '' });
        this.registroForm.reset();
        this.modo.set('login');
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.mostrarError('No se pudo registrar', error);
      },
    });
  }

  // Muestra el mensaje que manda el backend (o uno general si no hay conexión)
  private mostrarError(titulo: string, error: HttpErrorResponse): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      text: error.error?.message || 'No hay conexión con el servidor',
    });
  }
}
