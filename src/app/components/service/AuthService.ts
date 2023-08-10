import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly AVATAR_KEY = 'avatar';
    
    constructor(private jwtHelper: JwtHelperService) { }

    public setAuthToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    public getAuthToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    public removeAuthToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    public getUserRole(): [string] | [] {
        const token = this.getAuthToken();
        if (token) {
            const decodedToken = this.jwtHelper.decodeToken(token);
            return decodedToken.role;
        }
        return [];
    }

    public setUserAvatar(avatar: string): void {
        localStorage.setItem(this.AVATAR_KEY, avatar);
    }

    public getUserAvatar(): string | null {
        return localStorage.getItem(this.AVATAR_KEY);
    }
}
