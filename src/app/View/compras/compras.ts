import { Component, inject, signal } from '@angular/core';
import { Tabla } from '../../Components/tabla/tabla';
import { ComprasService, Compra } from '../../Services/compras';
import { formatearPesos } from '../../utils/formato';

// Omit = igual que Compra pero sin productos ni total; & = se agregan otra vez como texto.
// El | dentro de Omit significa "y también" quitar 'total'
type FilaCompra = Omit<Compra, 'productos' | 'total'> & { productos: string; total: string };

// Vista (página) de Compras
@Component({
  imports: [Tabla],
  selector: 'app-compras',
  styleUrl: './compras.css',
  templateUrl: './compras.html',
})
export class Compras {
  // inject() = pedirle a Angular el servicio de compras
  private comprasService = inject(ComprasService);

  // signal con la lista que muestra la tabla
  compras = signal<FilaCompra[]>([]);

  constructor() {
    // subscribe = pide las compras y, cuando lleguen, las prepara para la tabla
    this.comprasService.getCompras().subscribe((data) => {
      const filas = data.map((compra) => ({
        ...compra, // spread: copia todos los campos
        fecha: compra.fecha.slice(0, 10), // slice(0, 10) = toma los primeros 10 caracteres: "2026-10-15"
        total: formatearPesos(compra.total), // 55000 → "$ 55.000"
        // map + join = convierte la lista de productos en un solo texto: "2 x Vidrio, 1 x Cable"
        productos: compra.productos.map((p) => `${p.cantidad} x ${p.nombre}`).join(', '),
      }));
      this.compras.set(filas);
    });
  }
}
