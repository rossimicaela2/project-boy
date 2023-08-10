import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { UploadComponent } from "./components/home/pages/upload/upload.component";
import { MovimientosComponent } from "./components/home/pages/movimientos/movimientos.component";
import { LoadSociosComponent } from "./components/home/pages/load-socios/load-socios.component";
import { ResetPasswordComponent } from "./components/recovery/reset-password";
import { EditProfileComponent } from "./components/home/pages/editProfile/edit-profile.component";

const appRoutes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "home", component: HomeComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent, pathMatch: "full" },
  { path: 'reset-password', component: ResetPasswordComponent},
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'content', component: HomeComponent },
      { path: 'upload', component: UploadComponent },
      { path: 'movs', component: MovimientosComponent},
      { path: 'socios', component: LoadSociosComponent },
      { path: 'edit-profile', component: EditProfileComponent }
    ]
  }];

export const routing = RouterModule.forRoot(appRoutes);