import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm:FormGroup;
  hide = true;
  loading:boolean = false;
  constructor(private fb:FormBuilder,private router:Router,private adminService:AdminService,
    private snackBar:MatSnackBar) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userID:["",[Validators.required,Validators.email]],
      password:["",Validators.required]
    })
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  submitDetails(){
   if(this.loginForm.valid){
    this.loading = true;
    this.adminService.adminLogin(this.loginForm.value).subscribe((posRes:any)=>{
      this.loading = false;
      if(posRes.response == 3){
        sessionStorage.setItem('token',posRes.access_token);
        this.router.navigate(['admin','allBookings'])
      }else{
        this.openSnackBar(posRes.message,"")
      }
    },(err:HttpErrorResponse)=>{
      this.loading = false;
      this.openSnackBar(err.message,"")
      if(err.error instanceof Error){
        console.warn("Client Error",err.error)
      }else{
        console.warn("Server Error",err.error)
      }
    })
   }else{
     this.openSnackBar("Enter Valid User ID/Password","")
   }
  }
}
