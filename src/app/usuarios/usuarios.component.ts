import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserInterface } from '../user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit{
  constructor(public myAuth: AuthService){}

  misUsuarios:UserInterface[]=[];

  ngOnInit(){
    this.mostrarUsers();
  }

  mostrarUsers(): void {
    this.myAuth.getUsuarios().then((users) => {
        this.misUsuarios = users;
        console.log("Usuarios:", this.misUsuarios);
      });
  }

}
