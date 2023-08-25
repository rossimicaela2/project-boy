import { Component, OnInit } from "@angular/core";
import { UsersService } from "../service/users.service";
import { Router } from "@angular/router";
import { AuthService } from "../service/AuthService";
import { BackendStatusService } from '../service/backend-status.service'
import { DatePipe } from '@angular/common';
import { BackgroundService } from '../service/BackgroundService';

@Component({
    selector: "app-home",
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
