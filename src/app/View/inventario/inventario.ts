import { Component, inject, signal } from '@angular/core';
import { Tabla } from '../../Components/tabla/tabla';
import { ProductosService, Producto } from '../../Services/productos';
import { formatearPesos } from '../../utils/formato';

// Así se ve cada fila en la tabla: igual que Producto, pero con el precio como texto
type FilaProducto = Omit<Producto, 'precio'> & { precio: string };

@Component({
  imports: [Tabla],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario {
  private productosService = inject(ProductosService);

  productos = signal<FilaProducto[]>([]);

  constructor() {
    // Cada vez que se abre la página se piden los productos a la base de datos
    this.productosService.getProductos().subscribe((data) => {
      // El precio se muestra en pesos: 20000 → "$ 20.000"
      const filas = data.map((producto) => ({ ...producto, precio: formatearPesos(producto.precio) }));
      this.productos.set(filas);
    });
  }
}
