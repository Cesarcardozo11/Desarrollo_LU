import { Component, inject, signal } from '@angular/core';
import { Tabla } from '../../Components/tabla/tabla';
import { ProductosService, Producto } from '../../Services/productos';
import { formatearPesos } from '../../utils/formato';

// Omit = igual que Producto pero sin "precio"; & = luego se agrega precio como texto ("$ 20.000")
type FilaProducto = Omit<Producto, 'precio'> & { precio: string };

// Vista (página) de Inventario
@Component({
  imports: [Tabla],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario {
  // inject() = pedirle a Angular el servicio de productos
  private productosService = inject(ProductosService);

  // signal con la lista que muestra la tabla (empieza vacía)
  productos = signal<FilaProducto[]>([]);

  // constructor = se ejecuta al abrir la página
  constructor() {
    // subscribe = pide los productos y, cuando lleguen, los guarda en el signal
    this.productosService.getProductos().subscribe((data) => {
      // map = recorre la lista; ...producto copia los campos y cambia solo el precio
      const filas = data.map((producto) => ({ ...producto, precio: formatearPesos(producto.precio) }));
      // .set() = actualiza el signal → la tabla se redibuja
      this.productos.set(filas);
    });
  }
}
