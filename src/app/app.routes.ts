import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginSMSComponent } from './login-sms/login-sms.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

export const routes: Routes = [
    { path:'login', component: LoginComponent },
    { path:'signup', component: SignupComponent },
    { path:'numeroLog', component: LoginSMSComponent },
    { path:'users', component: UsuariosComponent }
];
