import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserInterface } from '../user.interface';
import { Expression } from '@angular/compiler';
import { createUserWithEmailAndPassword } from 'firebase/auth';


import { Auth } from 'firebase/auth';
import { Database } from 'firebase/database';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  constructor(public myAuth: AuthService){}

  username: string ="";
  email:string="";
  password:string="";
  phone:string="";
  errorMsg:string="";

  register(): void{
    console.log(this.username);
    console.log(this.email);
    if(this.validate_password(this.password) && this.validate_email(this.email) && this.validate_field(this.password)){
      this.myAuth.register(this.email, this.username, this.password, this.phone).subscribe(() => {
         alert("Usuario registrado");
      },(error) => {
        // Error al registrar usuario
        console.error("Error al registrar usuario:", error);
        if (error.code === "auth/email-already-in-use") {
          this.errorMsg = "El correo electrónico ya está en uso. Por favor, intente con otro.";
        } else {
          this.errorMsg = "Ocurrió un error durante el registro. Por favor, inténtelo de nuevo más tarde.";
        }
      });
    }
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
