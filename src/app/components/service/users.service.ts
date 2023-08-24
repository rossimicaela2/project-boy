import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import UserCredentials from "../utils/user-credentials";
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from "./AuthService";

@Injectable({
    providedIn: "root",
})
export class UsersService {
    private apiUrl = 'http://13.59.171.168:8080'; // Reemplaza con la URL de tu API

    constructor(private http: HttpClient, private authService: AuthService) { }

    login(credentials: UserCredentials): Observable<boolean> {
        return this.http.post<string>(this.apiUrl + '/login', {
            name: credentials.name,
            password: credentials.password
        }).pipe(
            map((response: any) => {
                this.authService.setAuthToken(response.token); // Guarda el token en el almacenamiento local
                this.authService.setUserAvatar(response.avatar); // Guarda el token en el almacenamiento local
                this.authService.setUserRole(response.roles); // Guarda el token en el almacenamiento local
                return true;
            }),
            catchError((error: any) => {
                return of(false);
            })
        );
    }

    registerUser(user: object): Observable<boolean> {
        return this.http.post<string>(this.apiUrl + '/register',user).pipe(
            map((response: any) => {
                return true;
            }),
            catchError((error: any) => {
                console.error('Error during register:', error);
                return of(false);
            })
        );
    }

    recovery(email: object): Observable<boolean> {
        return this.http.post<string>(this.apiUrl + '/recovery', email).pipe(
            map((response: any) => {
                return true;
            }),
            catchError((error: any) => {
                return of(false);
            })
        );
    }

    resetPassword(data: object): Observable<boolean> {
        return this.http.post<string>(this.apiUrl + '/reset', data).pipe(
            map((response: any) => {
                return true;
            }),
            catchError((error: any) => {
                return of(false);
            })
        );
    }

    uploadExcel(file: File, sheetname: string = ''): Observable<any> {
        const formData: FormData = new FormData();
        const token = this.authService.getAuthToken();

        formData.append('file', file, file.name);
        if (sheetname != '') {
            formData.append('sheetname', sheetname); // 'sheetName' es el nombre de la hoja que deseas recuperar en el backend
        }
        if (token) {
            const headers = {
                'Authorization': 'Bearer ' + token
            };

            return this.http.post<any>(this.apiUrl + '/upload-excel', formData, { headers });
        } else {
            // Maneja el caso en el que no se encuentre el token en el localStorage
            console.error('Error during uploadExcel');
            return of('Token not found');
        }
    }

    uploadSocios(file: File, sheetname: string = ''): Observable<any> {
        const formData: FormData = new FormData();
        const token = this.authService.getAuthToken();

        formData.append('file', file, file.name);
        if (sheetname != '') {
            formData.append('sheetname', sheetname); // 'sheetName' es el nombre de la hoja que deseas recuperar en el backend
        }
        if (token) {
            const headers = {
                'Authorization': 'Bearer ' + token
            };

            return this.http.post<any>(this.apiUrl + '/upload-socios', formData, { headers });
        } else {
            // Maneja el caso en el que no se encuentre el token en el localStorage
            console.error('Error during uploadExcel');
            return of('Token not found');
        }
    }


    processFile(file: File): Observable<boolean> {
        const formData: FormData = new FormData();
        const token = this.authService.getAuthToken();
        formData.append('file', file, file.name);
        if (token) {
            const headers = {
                'Authorization': 'Bearer ' + token
            };
            return this.http.post<any>(this.apiUrl + '/upload', formData, { headers }).pipe(
                map((response: any) => {
                    if (response && response.status === 'SUCCESS') {
                        console.log('Upload successful');
                        return true;
                    } else {
                        console.log('Upload failed');
                        return false;
                    }
                }),
                catchError((error: any) => {
                    console.error('Error during UPLOAD' + error);
                    return of(false);
                })
            );
        } else {
            console.error('Error during UPLOAD ""' );
            return of(false);
        }
    }


    listado(): Observable<any> {
        const token = this.authService.getAuthToken();
         if (token) {
            const headers = {
                'Authorization': 'Bearer ' + token
            };

            return this.http.post<any>(this.apiUrl + '/listado', { headers });
        } else {
            // Maneja el caso en el que no se encuentre el token en el localStorage
            console.error('Error during uploadExcel');
            return of('Token not found');
        }
    }

    sendSelectedItemsToBackend(selection: object): Observable<any> {
        console.log("ENVIO!!!");
        console.log(''+ selection);
        const token = this.authService.getAuthToken();
        if (token) {
            const headers = {
                'Authorization': 'Bearer ' + token
            };

           return this.http.post(this.apiUrl + '/selection', selection, { headers })
        } else {
            return of('Error during uploadExcel');
        }
    }

    searchClients(query: string): Observable<Client[]> {
        const url = '/clients?query=' + query;
        return this.http.get<Client[]>(this.apiUrl + url);
    }

    downloadFile(filename: string): Observable<Blob> {
        console.log("SE QUIERE BAJAR " + filename);
        const url = '/files/' + filename;
        return this.http.get(this.apiUrl + url, { responseType: 'blob' });
    }


    getPersonalInformation(): Observable<any> {
        const token = this.authService.getAuthToken();
        if (token) {
            const headers = {
                'Authorization': token
            };
            console.log("TOKEN ENVIADO " + token);
            return this.http.get<any>(this.apiUrl + '/user', { headers });
        } else {
            console.error('Error during getPersonalInformation: Token not found');
            return of('Token not found');
        }
    }

    updateUser(user: string, email: string, avatar: File): Observable<boolean> {
        const formData: FormData = new FormData();
        formData.append('name', user);
        formData.append('email', email);
        formData.append('avatar', avatar);
        return this.http.post<string>(this.apiUrl + '/update', formData).pipe(
            map((response: any) => {
                return true;
            }),
            catchError((error: any) => {
                console.error('Error during update:', error);
                return of(false);
            })
        );
    }

}
interface Client {
    nombre: string
    cuij: string
}