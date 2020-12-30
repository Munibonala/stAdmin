import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  isdetailsPage:boolean = false;
  isSideNavOpen:boolean = false;
  constructor(private adminService:AdminService, private router:Router) {

   }

  ngOnInit() {
    let token = sessionStorage.getItem('token');
    if(token == null){
      console.log("Token",token);
     this.router.navigateByUrl('/login');
    }
  }
  logOut(){
    sessionStorage.clear();
    this.router.navigateByUrl('/login')
  }
  openSideNav(){
    
  }
}
