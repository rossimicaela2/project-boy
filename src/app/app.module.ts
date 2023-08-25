import { HttpClientModule } from "@angular/common/http";
import { routing } from "./app-routing.module";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { ResetPasswordComponent } from "./components/recovery/reset-password";
import { HomeComponent } from "./components/home/home.component";
import { MovimientosComponent } from "./components/home/pages/movimientos/movimientos.component";
import { EditProfileComponent } from "./components/home/pages/editProfile/edit-profile.component";
import { FileSaverModule } from 'ngx-filesaver';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from "./components/service/AuthService";
import { JwtHelperService} from "@auth0/angular-jwt";
import { JwtModule } from "@auth0/angular-jwt";
import { JWT_OPTIONS } from "@auth0/angular-jwt";
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SharedService } from "./components/service/SharedService";


@NgModule({
  declarations: [
    AppComponent, 
    LoginComponent, 
    ResetPasswordComponent,
    HomeComponent,
    MovimientosComponent,
    EditProfileComponent],
  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule, 
    routing,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule, MatInputModule, MatSortModule, FileSaverModule, MatTabsModule, NgxExtendedPdfViewerModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useValue: {
          // Aquí puedes configurar las opciones de JWT si es necesario
        }
      }
    }),
],
  providers: [AuthService, JwtHelperService, SharedService],
  bootstrap: [AppComponent],
})
export class AppModule { }

