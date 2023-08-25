import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { API_BASE_URL, API_TIME_STATUS } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class BackendStatusService {

  private backendUrl = API_BASE_URL + '/api/status'; 
  private checkInterval = API_TIME_STATUS; 

  constructor(private http: HttpClient) { }

  checkBackendStatus(): Observable<boolean> {
    return interval(this.checkInterval).pipe(
      switchMap(() => this.http.get(this.backendUrl)),
      map(() => true),
      catchError(() => of(false))
    );
  }
}
