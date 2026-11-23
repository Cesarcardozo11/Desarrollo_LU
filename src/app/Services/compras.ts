import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

interface RespuestaApi<T> {
  success: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private readonly url = `${environment.apiUrl}/v1/compras`;
  private http = inject(HttpClient);

  getCompras(): Observable<Compra[]> {
    return this.http.get<RespuestaApi<Compra[]>>(this.url).pipe(map((res) => res.data));
  }
}
