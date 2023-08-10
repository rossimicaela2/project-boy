import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsersService } from "../service/users.service";
import { Router } from "@angular/router";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.html',
    styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
    token: string = "";
    password: string = "";
    resetPasswordError: string = "";
    resetPasswordSuccess: string = "";
    loading: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient,
        public userService: UsersService,
        public router: Router
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.loading = true;
            this.token = params['token'];
            this.verifyTokenAndResetPassword();
        });
    }

    verifyTokenAndResetPassword() {
        const requestBody = {
            resetToken: this.token
        };

        this.userService.validateToken(requestBody).subscribe(isValid => {
            this.loading = false;
            if (!isValid) {
                this.password = "";
                this.resetPasswordSuccess = "";
                this.resetPasswordError = 'Hubo un problema con su autenticación.';
            }
        });
    }

    resetPassword() {
        if (this.password == "") {
            this.resetPasswordError = 'Deben completar todos los campos.';
            return;
        }

        this.loading = true;
        const requestBody = {
            resetToken: this.token,
            password: this.password
        };

        this.userService.resetPassword(requestBody).subscribe(isValid => {
            this.loading = false;
            if (isValid) {
                this.password = "";
                this.resetPasswordSuccess = 'Se modificó la contraseña correctamente.';
                this.resetPasswordError = "";
            } else {
                this.password = "";
                this.resetPasswordSuccess = "";
                this.resetPasswordError = 'Hubo un problema con su autenticación.';
            }
        });
    }

    login() {
        this.router.navigateByUrl("/login");
    }
}
