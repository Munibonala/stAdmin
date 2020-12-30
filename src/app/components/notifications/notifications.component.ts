import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';
import { SendNotificationsDailogComponent } from '../send-notifications-dailog/send-notifications-dailog.component';
import { UserRefferalDailogComponent } from '../user-refferal-dailog/user-refferal-dailog.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications:any;
  isSent:boolean = true;
  baseUrl:string = "";
  message:string = "Fetching Data.."
  sentNotifications:Array<any> = [];
  receivedNotification:Array<any> = [];
  constructor(private adminService:AdminService, private dialog:MatDialog, private snackBar:MatSnackBar,
    private router:Router) { }

  ngOnInit() {
    this.baseUrl = this.adminService.baseUrl;
    this.fetchNotifications()
  }
  changeView(event){
    if(event.value == "true"){
      this.isSent = true;
    }else{
      this.isSent = false;
    }
  }
  fetchNotifications(){
    this.message = "Fetching Data..."
    this.adminService.showLoader.next(true);
  let obj =  {
      "userID":"enquiry@startasker.com"
  }
  let token = sessionStorage.getItem('token');
    this.adminService.fetchNotifications(obj,token).subscribe((posRes)=>{
      this.message = "No data found"
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.sentNotifications = posRes.notificationData.sentInbox.reverse();
        this.receivedNotification = posRes.notificationData.recievedInbox.reverse();
        console.log("receivedNotification",this.receivedNotification);
        
      }else{
        this.openSnackBar(posRes.message,"");
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"");
      if(err.error instanceof Error){
        console.warn("Client Error",err.message);
      }else{
        console.warn("Server Error",err.error);
      }
    })
  }
  opendetails(){
    let dialogRef = this.dialog.open(SendNotificationsDailogComponent,{
      panelClass:'col-md-6',
      hasBackdrop : true,
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe((res)=>{
      if(res){
        this.fetchNotifications()
      }
    })
  }
  navigateRelated(details){
    console.log(details);
    if(details.data.type == "AccountVerification"){
      this.router.navigate(['/admin','customer',details.data.userID])
    }
    if(details.data.type == "withDrawnEarnedAmount"){
      let dailogRef = this.dialog.open(UserRefferalDailogComponent,{
        panelClass : 'col-md-8',
        hasBackdrop :  true,
        disableClose : true,
        data : details
      })
    }
  }
  showDetails(details){
    if(details.data.type == "Offer"){
      this.router.navigate(['my-tasks','task',details.data.postID])
    }
    if(details.data.type == "OfferReplayToProvider"){
      this.router.navigate(['my-tasks','task',details.data.postID])
    }
    if(details.data.type =="Booking"){
      this.router.navigate(['bookings','booking-job-details',details.data.bookingID]) 
    }
    if(details.data.type =="WithDrawn"){
      this.router.navigate(['bookings','booking-job-details',details.data.bookingID]) 
    }
    if(details.data.type =="PostJob"){
      this.router.navigate(['browsejobs','job',details.data.postID]) 
    }
    if(details.data.type =="AccountVerification"){
      this.router.navigate(['profile', details.data.userID]);
    }
    if(details.data.type =="AdminPaymentDoneToProvider"){
      this.router.navigate(['bookings','booking-job-details',details.data.bookingID])
    }
    if(details.data.type =="TaskReminder"){
      this.router.navigate(['bookings','booking-job-details',details.data.bookingID])
    }
    if(details.data.type =="Earnings"){
      this.router.navigateByUrl('/my-account/reffer-earn')
    }
    if(details.data.type =="Ratings"){
      this.router.navigate(['browsejobs','job',details.data.postID]) 
    }
  }
  deleteAll(){
    let obj = {
      "type":"Sent",
  "userID":"enquiry@startasker.com"
    }
    if(this.isSent){
       obj.type = "Sent"
    }else{
       obj.type = "Received" 
    }
    this.adminService.showLoader.next(true);
    let token = sessionStorage.getItem('token')
    this.adminService.deleteAllNotifiCations(obj,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.openSnackBar(posRes.message,"")
        this.fetchNotifications();
      }else{
        this.openSnackBar(posRes.message,"");
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"");
      if(err.error instanceof Error){
        console.warn("Client Error",err.message);
      }else{
        console.warn("Server Error",err.error);
      }
    })
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  delete(notification){
    console.log(notification);
    let message = `Do you want to delete ${notification.notification.title} notification ?` 
    let dailogRef = this.dialog.open(DeleteDailogComponent, {
      panelClass: 'col-md-4',
      hasBackdrop: true,
      disableClose:true,
      data : message
    })
    dailogRef.afterClosed().subscribe(res=>{
      if(res){
        this.adminService.showLoader.next(true);
        let type = "Recieve";
        if(this.isSent){
          type = "Sent";
        }else{
          type = "Recieve";
        }
        let obj = {
          type:type,
          userID:"enquiry@startasker.com",
          notifyID : notification.notifyID
        };
        console.log(obj);
        
        let token = sessionStorage.getItem('token')
        this.adminService.deleteNotifiCation(obj,token).subscribe((posRes)=>{
          this.adminService.showLoader.next(false);
          if(posRes.response == 3){
           this.openSnackBar(posRes.message,"");
           this.fetchNotifications() 
          }else{
            this.openSnackBar(posRes.message,"");
          }
        },(err:HttpErrorResponse)=>{
          this.adminService.showLoader.next(false);
          this.openSnackBar(err.message,"");
          if(err.error instanceof Error){
            console.warn("Client Error",err.error);
          }else{
            console.warn("Server Error",err.error);
          }
        })
      }
    })
  }
}
