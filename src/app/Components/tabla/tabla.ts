import { Component, computed, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import titulos from './titulos.json';

// interface = describe una columna: qué campo del objeto mostrar y qué título ponerle
export interface Columna {
  campo: string;
  titulo: string;
}

// Tabla reutilizable: recibe las filas que llegan de la base de datos (data)
// y arma las columnas sola con las keys del JSON.
// Componente reutilizable = la misma pieza sirve en Clientes, Inventario y Compras.
@Component({
  imports: [MatTableModule], // la tabla de Angular Material
  selector: 'app-tabla',
  styleUrl: './tabla.css',
  templateUrl: './tabla.html',
})
export class Tabla {
  // input() = un dato que el componente RECIBE desde afuera.
  // Se usa así en el HTML de la vista: <app-tabla [data]="productos()">
  // any[] = una lista de cualquier tipo (así sirve para clientes, productos o compras)
  readonly data = input<any[]>([]);

  // computed = un valor que se CALCULA a partir de otros signals y se actualiza solo.
  // Ejemplo: si la primera fila es { id: 1, codigo: 'LUL-001' }
  // las keys son ['id', 'codigo'] y los títulos salen de titulos.json.
  // Si una key no está en titulos.json, se usa la key tal cual.
  readonly columnas = computed<Columna[]>(() => {
    const primeraFila = this.data()[0];
    if (!primeraFila) {
      return [];
    }
    // Record<string, string> = un objeto con textos como claves y como valores
    const nombres: Record<string, string> = titulos;
    // Object.keys = la lista de nombres de los campos de un objeto
    return Object.keys(primeraFila).map((key) => ({
      campo: key,
      // || = si no hay título en el JSON, usa el nombre del campo
      titulo: nombres[key] || key,
    }));
  });

  // mat-table necesita solo la lista de nombres de campo (otro computed)
  readonly displayedColumns = computed(() => this.columnas().map((c) => c.campo));
}
