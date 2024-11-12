import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { valoracionesInterface } from '../models/valoraciones.model';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  private apiUrl = "http://localhost:3000/api/valoracion";  // Usar apiUrl desde environment

  constructor(private http: HttpClient) {}

  // Obtener todos los usuarios
  getValoracion(): Observable<valoracionesInterface[]> {
    return this.http.get<valoracionesInterface[]>(`${this.apiUrl}`);
  }

  // Agregar un nuevo usuario
  addValoracion(valoracion: valoracionesInterface): Observable<valoracionesInterface> {
    return this.http.post<valoracionesInterface>(this.apiUrl, valoracion);
  }

  // Actualizar un usuario existente
  updateValoracion(valoracion: valoracionesInterface): Observable<valoracionesInterface> {
    return this.http.put<valoracionesInterface>(`${this.apiUrl}/${valoracion._id}`, valoracion);
  }

  // Eliminar un usuario por su _id
  deleteValoracionById(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}