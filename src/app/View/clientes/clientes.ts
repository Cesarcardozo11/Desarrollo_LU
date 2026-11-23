import { Component, inject, signal } from '@angular/core';
import { Tabla } from '../../Components/tabla/tabla';
import { ClientesService, Cliente } from '../../Services/clientes';

// Así se ve cada fila en la tabla: igual que Cliente, pero con la fecha como texto
type FilaCliente = Omit<Cliente, 'fecha_creacion'> & { fecha_creacion: string };

@Component({
  selector: 'app-clientes',
  imports: [Tabla],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  private clientesService = inject(ClientesService);

  clientes = signal<FilaCliente[]>([]);

  constructor() {
    this.clientesService.getClientes().subscribe((data) => {
      // La fecha llega como "2026-11-23T04:02:34.677Z"; en la tabla solo se muestra "2026-11-23".
      // 'en-CA' es el formato año-mes-día, y usa la hora de Colombia (no la de Londres)
      const filas = data.map((cliente) => ({
        ...cliente,
        fecha_creacion: cliente.fecha_creacion
          ? new Date(cliente.fecha_creacion).toLocaleDateString('en-CA')
          : '',
      }));
      this.clientes.set(filas);
    });
  }
}
