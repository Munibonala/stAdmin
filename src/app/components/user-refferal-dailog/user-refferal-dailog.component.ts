import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-user-refferal-dailog',
  templateUrl: './user-refferal-dailog.component.html',
  styleUrls: ['./user-refferal-dailog.component.css']
})
export class UserRefferalDailogComponent implements OnInit {
  referralData:Array<any> = [];
  loading:boolean = false;
  referalMsg:string = "Fetching Data.."
  constructor(private dialogRef: MatDialogRef<NotificationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private adminService : AdminService, private snackBar:MatSnackBar) { }

  ngOnInit() {
    this.fetchUserRefferals()
  }
    //message alerts showing
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 3000
  });
}
fetchUserRefferals(){
  let obj = {
    userID : this.data.data.userID
  };
  this.loading = true;
  let token = sessionStorage.getItem('token')
this.adminService.fetchUserReffaral(obj,token).subscribe((posRes)=>{
  console.log(posRes.earnedReferrals);
  this.loading = false;
  this.referalMsg = "No Data Found..."
  if(posRes.response == 3){
    this.referralData = posRes.earnedReferrals
  }else{
    this.openSnackBar(posRes.message,"")
  }
},(err:HttpErrorResponse)=>{
  this.loading = false;
  this.referalMsg = "No Data Found...";
          this.openSnackBar(err.message,"");
          if(err.error instanceof Error){
            console.warn("Client Error",err.error);
          }else{
            console.warn("Server Error",err.error);
          }
})
}
closeTab(){
  this.dialogRef.close()
}
markAsPaid(refferal,i){
  this.loading = true;
let obj = {postID:refferal._id};
let token = sessionStorage.getItem('token');
this.adminService.makeAsPaid(obj,token).subscribe((posRes)=>{
this.loading = false;
if(posRes.response == 3){
this.referralData[i].isTransferStatus = true;
this.openSnackBar(posRes.message,"");
}else{
this.openSnackBar(posRes.message,"")
}
},(err:HttpErrorResponse)=>{
this.loading = false;
this.openSnackBar(err.message,"");
if(err.error instanceof Error){
  this.openSnackBar(err.message,"");
  console.warn("Client Error",err.error);
}else{
  console.warn("Server Error",err.error);
}
})
}
}
