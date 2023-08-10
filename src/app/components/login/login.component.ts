import { Component } from "@angular/core";
import { UsersService } from "../service/users.service";
import UserCredentials from "../utils/user-credentials";
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]})

export class LoginComponent {
    user: string = '';
    password: string = '';
    errorMessage: string = '';

    register_name: string = '';
    register_email: string = '';
    register_password: string = '';
    register_confirmPassword: string = '';
    register_errorMessage: string = '';

    recovery_email: string = '';
    recovery_errorMessage: string = '';
    recovery_successMessage: string = '';

    isLoginVisible = true;
    isRecovery = false;
    loading: boolean = false;

    constructor(public userService: UsersService, public router: Router) { }

    login() {
        if (this.user == "" || this.password == "") {
            this.errorMessage = 'Deben completar todos los campos.';
            return;
        }

        this.loading = true;
        const credentials: UserCredentials = {
            name: this.user,
            password: this.password
        };

        this.userService.login(credentials).subscribe(isValid => {
            this.loading = false;
            if (isValid) {
                this.errorMessage = '';
                this.router.navigateByUrl("/home");
            } else {
                this.errorMessage = 'Credenciales inválidas. Por favor, intenta nuevamente.';
            }
        });
    }

    register() {
        console.log(this.register_name);
        console.log(this.register_password);
        this.registrarUsuario();
    }

    registrarUsuario() {
        const newUser = {
            name: this.register_name,
            password: this.register_password,
            email: this.register_email,
            roles: ['USER']
        };

        if (this.register_password != this.register_confirmPassword) {
            this.register_errorMessage = 'Las contraseñas no son iguales.';
            return;
        }
        if (this.register_name == "" || this.register_email == "" || this.register_password == "" || this.register_confirmPassword == "") {
            this.register_errorMessage = 'Deben completar todos los campos.';
            return;
        }
        this.loading = true;
        this.userService.registerUser(newUser).subscribe(isValid => {
            this.loading = false;
            if (isValid) {
                this.register_errorMessage = 'Usuario creado correctamente.';
            } else {
                this.register_errorMessage = 'No se puede crear el usuario. Compruebe que no esté regristrado.';
            }
        });
    }

    recovery() {
        this.loading = true;
        const emailSend = {
            email: this.recovery_email
        }
        this.userService.recovery(emailSend).subscribe(isValid => {
            this.loading = false;
            if (isValid) {
                this.recovery_email = "";
                this.recovery_errorMessage = '';
                this.recovery_successMessage = 'Se envio mensaje al correo de email indicado.';
            } else {
                this.recovery_email = "";
                this.recovery_successMessage = '';
                this.recovery_errorMessage = 'Email inválido.';
            }
        });
    }

    toggleForm() {
        this.isRecovery = false;
        this.isLoginVisible = !this.isLoginVisible;
        this.errorMessage = ''; 
    }

    toggleFormRecovery() {
        this.isRecovery = true;
        this.isLoginVisible = false;
        this.errorMessage = ''; 
    }
}
