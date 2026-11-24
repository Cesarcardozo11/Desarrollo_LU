import { Component, inject, signal } from '@angular/core';
import { Tabla } from '../../Components/tabla/tabla';
import { ClientesService, Cliente } from '../../Services/clientes';

// type = crea un tipo nuevo.
// Omit<Cliente, 'fecha_creacion'> = igual que Cliente pero SIN fecha_creacion...
// & { fecha_creacion: string } = ...y se la vuelve a agregar, ahora como texto.
type FilaCliente = Omit<Cliente, 'fecha_creacion'> & { fecha_creacion: string };

// Vista (página) de Clientes. @Component = esta clase es un componente
@Component({
  selector: 'app-clientes',
  imports: [Tabla], // usa la tabla reutilizable en su HTML
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes {
  // inject() = pedirle a Angular el servicio de clientes
  private clientesService = inject(ClientesService);

  // signal = variable que actualiza la pantalla sola cuando cambia.
  // Empieza como lista vacía [] y se llena cuando llegan los datos.
  clientes = signal<FilaCliente[]>([]);

  // constructor = se ejecuta UNA vez, cuando se crea el componente (al abrir la página)
  constructor() {
    // subscribe = "pide los clientes y avísame cuando lleguen"
    this.clientesService.getClientes().subscribe((data) => {
      // La fecha llega como "2026-11-23T04:02:34.677Z"; en la tabla solo se muestra "2026-11-23".
      // 'en-CA' es el formato año-mes-día, y usa la hora de Colombia (no la de Londres)
      // data.map = recorre la lista y crea una nueva con cada cliente transformado
      const filas = data.map((cliente) => ({
        // ...cliente = spread: copia todos los campos del cliente
        ...cliente,
        // condición ? si-sí : si-no (operador ternario)
        fecha_creacion: cliente.fecha_creacion
          ? new Date(cliente.fecha_creacion).toLocaleDateString('en-CA')
          : '',
      }));
      // .set() = cambia el valor del signal → la tabla se redibuja sola
      this.clientes.set(filas);
    });
  }
}
