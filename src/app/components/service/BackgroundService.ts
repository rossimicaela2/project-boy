import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {
    public backgroundImage: string = 'url("../assets/logo.png")';
    public backgroundColor: string = 'linear-gradient(to top, #303F9F, #C5CAE9, #eeeff4, #ffffff), linear-gradient(to bottom, #ffffff, #eeeff4, #C5CAE9, #303F9F)';
}
