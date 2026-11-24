// interface = la forma de un cliente (igual a las columnas de la tabla clientes)
export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  edad?: number;
  sexo?: string;
  email: string;
  fecha_creacion?: Date;
}

import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// @Injectable + providedIn: 'root' = servicio con una sola copia para toda la app
@Injectable({
  providedIn: 'root',
})
export class ClientesService {

  private readonly url = `${environment.apiUrl}/clientes`;

  // Otra forma de pedir un servicio: en el constructor.
  // "private http: HttpClient" = Angular entrega el HttpClient (hace lo mismo que inject()).
  constructor(private http: HttpClient) {}

  // Cada método llama a una ruta del backend y devuelve un Observable (respuesta que llega después).
  // Cliente[] = una LISTA de clientes

  // GET = leer. Obtener todos los clientes
  public getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url);
  }

  // GET con id = leer uno. Obtener un cliente por ID
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }

  // POST = crear. Crear un cliente
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, cliente);
  }

  // PUT = reemplazar. Actualizar completamente un cliente
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/${id}`, cliente);
  }

  // DELETE = borrar. Eliminar un cliente (void = no devuelve datos)
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
