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
 
@Injectable({
  providedIn: 'root',
})
export class ClientesService {
 
  private readonly url = `${environment.apiUrl}/clientes`;
 
  constructor(private http: HttpClient) {}
 
  // Obtener todos los clientes
  public getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url);
  }
 
  // Obtener un cliente por ID
  getClienteById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.url}/${id}`);
  }
 
  // Crear un cliente
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.url, cliente);
  }
 
  // Actualizar completamente un cliente
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.url}/${id}`, cliente);
  }
 
  // Actualizar parcialmente un cliente
  actualizarParcialCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.patch<Cliente>(`${this.url}/${id}`, cliente);
  }
 
  // Eliminar un cliente
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}