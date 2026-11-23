import { Component, inject, signal } from '@angular/core';
import { Tabla } from '../../Components/tabla/tabla';
import { ComprasService, Compra } from '../../Services/compras';
import { formatearPesos } from '../../utils/formato';

// Así se ve cada fila en la tabla: los productos y el total pasan a ser texto
type FilaCompra = Omit<Compra, 'productos' | 'total'> & { productos: string; total: string };

@Component({
  imports: [Tabla],
  selector: 'app-compras',
  styleUrl: './compras.css',
  templateUrl: './compras.html',
})
export class Compras {
  private comprasService = inject(ComprasService);

  compras = signal<FilaCompra[]>([]);

  constructor() {
    this.comprasService.getCompras().subscribe((data) => {
      // Se ajustan algunos campos para que se vean bien en la tabla
      const filas = data.map((compra) => ({
        ...compra,
        fecha: compra.fecha.slice(0, 10),
        total: formatearPesos(compra.total),
        productos: compra.productos.map((p) => `${p.cantidad} x ${p.nombre}`).join(', '),
      }));
      this.compras.set(filas);
    });
  }
}
