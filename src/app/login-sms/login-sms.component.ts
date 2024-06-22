import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-sms',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login-sms.component.html',
  styleUrl: './login-sms.component.css'
})
export class LoginSMSComponent implements AfterViewInit{
  constructor(public myAuth: AuthService){}
  @ViewChild('captchaContainer', { static: false }) captchaContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.captcha();
  }

  opcion:number=0;
  username: string ="";
  email:string="";
  password:string="";
  errorMsg:string="";
  phone:string="";
  codigo:any;
  captchaFlag:boolean=true;

  

  captcha(): void {
    if (this.captchaContainer) {
      this.myAuth.initializeRecaptcha(this.captchaContainer.nativeElement);
      console.log("Captcha initialized");
      this.captchaFlag = true;
    } else {
      console.log("Captcha container is undefined");
    }
  }

  enviarCodigo(): void {
    //Validamos si existe la cuenta
    this.myAuth.existe(this.phone).then(existe =>{
      if(existe){
        this.myAuth.sendCode(this.phone).subscribe(() => {
          alert("Codigo enviado");
          this.captchaFlag=false;
        }, error => {
          alert("Error al enviar el codigo");
        });
      }else{
        this.errorMsg = "Error, no hay una cuenta registrada con este numero de telefono";
      }
    });
  }

  ingresarTel():void{
    this.myAuth.loginSMS(this.codigo).subscribe(() =>{
      alert("Ingresado");
    }, error =>{
      alert("Error al ingresar");
    });
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

