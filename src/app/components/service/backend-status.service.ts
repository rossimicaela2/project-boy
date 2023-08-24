import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusService {

  private backendUrl = 'http://13.59.171.168:8080/api/status'; // URL del endpoint de estado del backend
  private checkInterval = 5000; // Intervalo de verificación en milisegundos

  constructor(private http: HttpClient) { }

  checkBackendStatus(): Observable<boolean> {
    return interval(this.checkInterval).pipe(
      switchMap(() => this.http.get(this.backendUrl)),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
