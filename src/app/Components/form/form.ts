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

@Component({
  selector: 'app-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form {
  private fb = inject(FormBuilder);
  private productosService = inject(ProductosService);
  private router = inject(Router);

  // Mientras se guarda el producto se desactiva el botón
  cargando = signal(false);

  // Opciones del campo "Categoría"
  readonly categorias = ['Protección', 'Fundas', 'Accesorios', 'Audio', 'Cables'];

  // Formulario reactivo del producto.
  // Precio y stock empiezan vacíos (null) para que los campos no muestren un 0.
  productoForm = this.fb.nonNullable.group({
    codigo: ['', [Validators.required, Validators.maxLength(20)]],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    categoria: ['', Validators.required],
    dispositivo: ['', [Validators.required, Validators.maxLength(50)]],
    precio: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    // Solo números enteros: no se venden 2,5 unidades
    stock: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]),
  });

  registrarProducto(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const datos = this.productoForm.getRawValue();
    this.cargando.set(true);

    this.productosService
      .crearProducto({ ...datos, precio: Number(datos.precio), stock: Number(datos.stock) })
      .subscribe({
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
