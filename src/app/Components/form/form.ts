import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { ProductosService } from '../../Services/productos';

// Formulario para agregar productos al inventario
@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  // inject() = pedirle a Angular lo que necesitamos
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private router = inject(Router);

  // signal: mientras se guarda el producto se desactiva el botón
  cargando = signal(false);

  // Opciones del campo "Categoría" (se recorren con @for en el HTML)
  readonly categorias = ['Protección', 'Fundas', 'Accesorios', 'Audio', 'Cables'];

  // Formulario reactivo del producto: cada línea es un campo con sus reglas (Validators).
  // Precio y stock empiezan vacíos (null) para que los campos no muestren un 0.
  productoForm = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.maxLength(20)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    categoria: ['', Validators.required],
    dispositivo: ['', [Validators.required, Validators.maxLength(50)]],
    // min(1) = el precio debe ser al menos 1
    precio: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    // pattern = el valor debe cumplir una expresión regular. /^\d+$/ = solo dígitos (número entero)
    stock: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]),
  });

  registrarProducto(): void {
    // Si hay errores, se muestran en cada campo y no se envía nada
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const datos = this.productoForm.getRawValue();
    this.cargando.set(true);

    // ...datos = copia todos los campos; Number() convierte precio y stock a número
    this.productosService
      .crearProducto({ ...datos, precio: Number(datos.precio), stock: Number(datos.stock) })
      .subscribe({
        // next = salió bien: alerta de éxito y luego ir a Inventario
        next: (producto) => {
          this.cargando.set(false);
          Swal.fire({
            icon: 'success',
            title: 'Producto registrado',
            text: `${producto.nombre} ya está en el inventario.`,
            timer: 1800,
            showConfirmButton: false,
          }).then(() => this.router.navigate(['/Inventario']));
        },
        // error = algo falló: muestra el mensaje del backend (ej. código repetido)
        error: (error: HttpErrorResponse) => {
          this.cargando.set(false);
          Swal.fire({
            icon: 'error',
            title: 'No se pudo registrar',
            text: error.error?.message || 'No hay conexión con el servidor',
          });
        },
      });
  }
}
