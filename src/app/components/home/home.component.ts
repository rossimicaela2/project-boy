import { Component, OnInit } from "@angular/core";
import { UsersService } from "../service/users.service";
import { Router } from "@angular/router";
import { AuthService } from "../service/AuthService";
import { BackendStatusService } from '../service/backend-status.service'
import { DatePipe } from '@angular/common';
import { BackgroundService } from '../service/BackgroundService'
import { SharedService } from "../service/SharedService";
import { Observable } from 'rxjs';

@Component({
    selector: "app-home",
    template: `
    <mat-sidenav-content class="custom-sidenav-content">
      <div class="content mat-elevation-z8" [style.background]="backgroundService.backgroundColor">
        <h2>Bienvenid@!\n          sistema de ingreso de archivos</h2>
        <router-outlet></router-outlet>
      </div>
    </mat-sidenav-content>
  `,
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
    currentDate: string | null = '';
    roles: string[] | null = null;
    avatarUrl: string | ArrayBuffer | null = null;

    constructor(public userService: UsersService, public router: Router, private authService: AuthService, 
      private backendStatusService: BackendStatusService, public backgroundService: BackgroundService) { 
        const today = new Date();
        const datePipe = new DatePipe('en-US');
        this.currentDate = datePipe.transform(today, 'dd/MM/yyyy');
        this.backgroundService.backgroundColor = 'linear-gradient(to top, #303F9F, #C5CAE9, #eeeff4, #ffffff), linear-gradient(to bottom, #ffffff, #eeeff4, #C5CAE9, #303F9F)';
     }
     
    ngOnInit() {
        this.backendStatusService.checkBackendStatus().subscribe(isValid => {
            if (isValid) {

            } else {
              this.router.navigateByUrl("/login");
            }
        });
        this.getUserLogged();
        this.roles = this.authService.getUserRole();
    }

    getUserLogged() {
      console.log("ACTUALIZA??");
      this.avatarUrl = "data:image/jpeg;base64," + this.authService.getUserAvatar();
     
    }

    logout() {
        this.router.navigateByUrl("/login");
    }
}
