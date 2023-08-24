import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly AVATAR_KEY = 'avatar';
    private readonly ROLES_KEY = 'roles';

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

    public setUserAvatar(avatar: string): void {
        localStorage.setItem(this.AVATAR_KEY, avatar);
    }

    public getUserAvatar(): string | null {
        return localStorage.getItem(this.AVATAR_KEY);
    }

    public setUserRole(roles: [string]): void {
        const rolesJSON = JSON.stringify(roles);
        localStorage.setItem(this.ROLES_KEY, rolesJSON);
    }

    public getUserRole(): [string] | [] {
        const rolesJSON = localStorage.getItem(this.ROLES_KEY);
        if (rolesJSON) {
            const roles = JSON.parse(rolesJSON);
            return roles;
        } else {
            return [];
        }
    }
}
