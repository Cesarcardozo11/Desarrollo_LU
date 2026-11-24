import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

// interface = la forma de un producto (igual a las columnas de la tabla productos)
export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  categoria: string;
  dispositivo: string;
  precio: number;
  stock: number;
}

// El backend responde { success, data }; aquí solo nos interesa "data".
// <T> = genérico: un "hueco" para un tipo que se decide al usarlo
// (RespuestaApi<Producto[]> = data es una lista de productos)
interface RespuestaApi<T> {
  success: boolean;
  data: T;
}

// Servicio de productos: una sola copia para toda la app
@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private readonly url = `${environment.apiUrl}/v1/productos`;
  private http = inject(HttpClient);

  // GET = leer todos los productos.
  // pipe + map = transforma la respuesta: de { success, data } deja solo data (la lista)
  getProductos(): Observable<Producto[]> {
    return this.http.get<RespuestaApi<Producto[]>>(this.url).pipe(map((res) => res.data));
  }

  // POST = crear un producto. También usa map para devolver solo el producto creado
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<RespuestaApi<Producto>>(this.url, producto).pipe(map((res) => res.data));
  }
}
