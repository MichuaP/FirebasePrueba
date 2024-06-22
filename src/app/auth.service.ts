import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithPhoneNumber, updateProfile, user } from '@angular/fire/auth';
import { RecaptchaVerifier, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Database, get, ref, set } from '@angular/fire/database';
import { Observable, from } from 'rxjs';
import { UserInterface } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firebaseAuth: Auth, private database: Database) {}

  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined> (undefined)
  confirmationResult: any;
  users!: UserInterface[];
  captchaVerifier: RecaptchaVerifier | undefined;

  //Función para registrar un usuario
  register(email: string, username: string, password:string, phone:string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(response => {
      return updateProfile(response.user, {displayName:username}).then(() =>{
        //GUardar en database realtime
        const userUID = response.user.uid;
        return set(ref(this.database, 'users/' + userUID),{
          username:username,
          email:email,
          phone:phone
        });
      });
    });
    return from(promise);
  }

  //Login con email and password
  login(email:string, password:string):Observable<void>{
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then(() => {});
    return from(promise);
  }

  //Logout
  logout():Observable<void>{
    const promise = signOut(this.firebaseAuth);
    return from(promise);
  }

  //Inicializar captcha
  initializeRecaptcha(element: HTMLElement):void {
    this.captchaVerifier = new RecaptchaVerifier(this.firebaseAuth,element, {});
    this.captchaVerifier.render().then(widgetId => {
      console.log("reCAPTCHA widget ID:", widgetId);
      return true;
    });
  }

  //Funcion para enviar el código al número de telefono
  sendCode(phone: string): Observable<void> {
    if (!this.captchaVerifier) {
      throw new Error("Captcha verifier is not initialized");
    }
    const promise = signInWithPhoneNumber(this.firebaseAuth, phone, this.captchaVerifier)
      .then(confirmationResult => {
        this.confirmationResult = confirmationResult;
        console.log("SMS sent");
      });
    return from(promise);
  }

  //Función para ingresar con el número de teléfono
  loginSMS(code: string): Observable<void> {
    if (!this.confirmationResult) {
      throw new Error("Confirmation result is not available");
    }
    const promise = this.confirmationResult.confirm(code)
      .then(() => {
        console.log("exito al ingresar");
      })
      .catch(() => {
        alert("Error con el código");
      })as Promise<void>;
    return from(promise);
  }

  //Función que lee la base de datos y verifica si el usuario existe
  existe(tel: string): Promise<boolean> {
    const usersRef = ref(this.database, 'users');
    return get(usersRef).then((snapshot) => {
      if (snapshot.exists()) {
        let flag = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          const phone = userData.phone;
          const username = userData.username;
          console.log("Phone:", phone);
          if (tel === phone) {
            console.log("Existe cuenta, proceder");
            flag = true;
          }
        });
        return flag;
      } else {
        console.log("No se encontraron usuarios");
        return false;
      }
    }).catch((error) => {
      console.error("Error al obtener usuarios:", error);
      return false;
    });
  }

  //Función que obtiene todos los usuarios de una base de datos
  getUsuarios(): Promise<UserInterface[]> {
    const usersRef = ref(this.database, 'users');
    return get(usersRef)
      .then((snapshot) => {
        const users: UserInterface[] = [];
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            users.push({
              username: userData.username,
              email: userData.email,
              phone: userData.phone,
            });
          });
        } else {
          console.log("No se encontraron usuarios");
        }
        return users;
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
        return [];
      });
  }
}
