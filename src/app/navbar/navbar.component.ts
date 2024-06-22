import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { signOut } from 'firebase/auth';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  constructor(public myAuth: AuthService){}

  ngOnInit(): void {
    this.myAuth.user$.subscribe(user => {
      if(user){
        this.myAuth.currentUserSig.set({
          email:user.email!,
          username:user.displayName!,
          phone:user.phoneNumber!
        });
      } else{
        this.myAuth.currentUserSig.set(null);
      }
      console.log(this,this.myAuth.currentUserSig());
    });
  }

  logout():void{
    this.myAuth.logout();
  }

}
