import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BackendStatusService } from '../app/components/service/backend-status.service'
import { AuthService } from '../app/components/service/AuthService';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private location: Location, private backendStatusService: BackendStatusService,
    private authService: AuthService, public router: Router) { }

  ngOnInit() {
    history.pushState(null, '', location.href);
    this.disableBackButton();
    // Verificar el estado del back-end periódicamente
    this.backendStatusService.checkBackendStatus().subscribe(
      () => {
        // El back-end está activo, no se hace nada
      },
      () => {
        // El back-end está inactivo, desloguear al usuario solo si no se ha redirigido antes
        if (this.router.url !== '/login') {
          this.router.navigateByUrl("/login");
        }
      }
    );
  }
  
  disableBackButton() {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }
}
