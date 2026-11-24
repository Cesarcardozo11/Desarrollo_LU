import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// interface = la forma de una compra.
// productos: { ... }[] = una LISTA de objetos (los productos de esa compra)
export interface Compra {
  id: number;
  clienteId: number;
  clienteNombre: string;
  fecha: string;
  total: number;
  estado: string;
  productos: {
    productoId: number;
    codigo: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }[];
}

// Respuesta del backend: { success, data }. <T> = genérico (el tipo de data)
interface RespuestaApi<T> {
  success: boolean;
  data: T;
}

// Servicio de compras: una sola copia para toda la app
@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private readonly url = `${environment.apiUrl}/v1/compras`;
  private http = inject(HttpClient);

  // GET = leer todas las compras. map = deja solo data
  getCompras(): Observable<Compra[]> {
    return this.http.get<RespuestaApi<Compra[]>>(this.url).pipe(map((res) => res.data));
  }
}
