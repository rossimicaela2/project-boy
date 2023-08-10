import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    token: string = "";

    constructor(private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.token = params['token'];
            // Aquí puedes llamar a un método para verificar el token y controlar la lógica de recuperación de contraseña
            this.verifyTokenAndResetPassword();
        });
    }

    verifyTokenAndResetPassword() {
        // Lógica para verificar el token y permitir al usuario restablecer la contraseña
        // Puedes enviar una solicitud HTTP al backend para verificar el token
        // y mostrar la interfaz para que el usuario ingrese una nueva contraseña
    }
}
