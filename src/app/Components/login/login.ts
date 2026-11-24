import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { NgOptimizedImage } from '@angular/common';
// SweetAlert2 = librería para mostrar alertas bonitas
import Swal from 'sweetalert2';
import { AuthService } from '../../Services/auth.service';

// Componente de login y registro
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule, // formularios reactivos ([formGroup], formControlName)
    MatFormFieldModule, // campos de Material (mat-form-field, mat-error)
    MatInputModule, // inputs de Material
    MatSelectModule, // listas desplegables (mat-select)
    MatButtonModule, // botones de Material
    NgOptimizedImage, // carga optimizada del logo
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // inject() = pedirle a Angular las herramientas que necesitamos
  // FormBuilder = ayuda a crear formularios reactivos con menos código
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // signal = variable que actualiza la pantalla cuando cambia.
  // 'login' | 'registro' = solo puede tener uno de esos dos valores (unión de tipos)
  modo = signal<'login' | 'registro'>('login');

  // Mientras se espera la respuesta del backend se desactiva el botón
  cargando = signal(false);

  // Formulario reactivo = el formulario y sus reglas se definen aquí (en el TypeScript).
  // nonNullable = al limpiarlo, los campos vuelven a '' en vez de null.
  // group = crea un FormGroup (el formulario completo); cada línea es un FormControl (un campo).
  // ['valor inicial', [reglas]]
  loginForm = this.fb.nonNullable.group({
    // Validators = reglas: required (obligatorio), email (formato de correo)
    email: ['', [Validators.required, Validators.email]],
    // minLength / maxLength = mínimo y máximo de caracteres
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  // Formulario reactivo para registrarse
  registroForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(50)]],
    apellido: ['', [Validators.required, Validators.maxLength(50)]],
    // La edad empieza vacía (null) para que el campo no muestre un 0.
    // number | null = puede ser un número o estar vacío. min / max = rango permitido
    edad: this.fb.control<number | null>(null, [Validators.required, Validators.min(1), Validators.max(120)]),
    sexo: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
  });

  // Opciones del campo "Sexo" (se recorren con @for en el HTML)
  readonly opcionesSexo = ['Femenino', 'Masculino', 'Otro'];

  // Cambia entre "Iniciar sesión" y "Registrarse".
  // condición ? valor-si-sí : valor-si-no  (operador ternario)
  cambiarModo(): void {
    this.modo.set(this.modo() === 'login' ? 'registro' : 'login');
  }

  iniciarSesion(): void {
    // invalid = el formulario tiene algún error
    if (this.loginForm.invalid) {
      // markAllAsTouched = marca todos los campos como tocados para que se vean los errores
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    // getRawValue = devuelve todos los valores del formulario: { email, password }
    // subscribe = envía la petición y espera la respuesta
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      // next = qué hacer si salió bien
      next: (response) => {
        this.cargando.set(false);
        // Swal.fire = muestra una alerta de SweetAlert
        Swal.fire({
          icon: 'success',
          // ?. = encadenamiento opcional: si user no existe, no da error
          title: `¡Bienvenido, ${response.user?.nombre}!`,
          timer: 1500,
          showConfirmButton: false,
          // .then = cuando se cierre la alerta, navegar a Clientes
        }).then(() => this.router.navigate(['/Clientes']));
      },
      // error = qué hacer si falló. HttpErrorResponse = el error que devuelve HttpClient
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
    const datos = this.registroForm.getRawValue();
    // { ...datos, edad: Number(datos.edad) } = copia los datos y convierte la edad a número
    this.authService.registrar({ ...datos, edad: Number(datos.edad) }).subscribe({
      next: () => {
        this.cargando.set(false);
        Swal.fire({
          icon: 'success',
          title: 'Usuario registrado',
          text: 'Ya puedes iniciar sesión con tu email y contraseña.',
        });
        // Se pasa al login con el email ya escrito.
        // reset = limpia el formulario (o lo deja con los valores que se le pasen)
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

  // Muestra el mensaje que manda el backend (o uno general si no hay conexión).
  // private = solo se usa dentro de este componente
  private mostrarError(titulo: string, error: HttpErrorResponse): void {
    Swal.fire({
      icon: 'error',
      title: titulo,
      // error.error?.message = el mensaje que envió el backend. || = si no hay, usa el texto de la derecha
      text: error.error?.message || 'No hay conexión con el servidor',
    });
  }
}
