import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { ClienteImpactadoDetails } from '../entities/ClienteImpactadoDetails';
import { ClienteImpactado } from '../entities/ClienteImpactado';

@Injectable({
  providedIn: 'root'
})
export class ClienteImpactadoService {

  private readonly apiUrl: string = "http://localhost:8080/api/cliente-impactado";

  constructor(private httpClient: HttpClient) { }

  getClienteImpactadoDetailsFromTheLast5Minutes(): Observable<ClienteImpactadoDetails[]> {
    return this.httpClient.get<ClienteImpactadoDetails[]>(`${this.apiUrl}/`);
  }

  getClienteImpactadoDetailByAppAndData(app: string, data: string): Observable<ClienteImpactadoDetails> {
    return this.httpClient.get<ClienteImpactadoDetails>(`${this.apiUrl}/${app}/${data}`);
  }

  getAllClienteImpactadosByAppFromLastHour(app: string): Observable<ClienteImpactado[]> {
    return this.httpClient.get<ClienteImpactado[]>(`${this.apiUrl}/${app}/last-hour`);
  }

}
