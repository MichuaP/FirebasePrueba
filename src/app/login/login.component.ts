import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(public myAuth: AuthService){}

  opcion:number=0;
  username: string ="";
  email:string="";
  password:string="";
  errorMsg:string="";
  phone:any;

  porCorreo(){
    this.opcion=1;
  }

  ingresar(): void{
    console.log(this.email);
    console.log(this.password);
    if(this.validate_password(this.password) && this.validate_email(this.email) && this.validate_field(this.password)){
      this.myAuth.login(this.email,this.password).subscribe(() => {
         alert("Usuario logeado");
      },
      error => {
        alert("Credenciales inválidas");
      }
    );
    }else{
      console.log("validacion fallida");
    }
  }

  //Permite cambiar la opcion
  regresar(){
    this.opcion=0;
  }

  validate_email(eml: string): boolean {
    const expression = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (expression.test(eml)) {
      // Email es válido
      return true;
    } else {
      alert("The email is not valid");
      return false;
    }
  }
  
  validate_password(pass:string):boolean{
    if(pass.length < 6){
      alert("The password has to be at least 6 characters");
      return false;
    }else{
      return true
    }
  }

  validate_field(field:any):boolean{
    if(field.length <= 0){
      alert("A field is missing");
      return false;
    }else{
      return true;
    }
  }

}
