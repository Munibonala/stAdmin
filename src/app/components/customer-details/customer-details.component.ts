import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { AccountVerificationModalComponent } from '../account-verification-modal/account-verification-modal.component';
import { ReviewModalComponent } from '../review-modal/review-modal.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit , OnChanges {
  asPoster:boolean = false;
  asTasker:boolean = false;
  image:string = "https://liveapi.startasker.com//images/Customers/oPJpQ1600825844027JPEG_20200923_095041_1007186395530940084.jpg";
  UserDetails:any;
  id:any;
  routeSub:any;
  baseUrl:string = "";
  gallery:Array<any>= [];
  skills:any;
  bankDetails:any;
  accountData:any = {}
  accountVerificationForm:FormGroup;
  posterReviews:any;
  isAccountVerified:boolean = false;
  isAccountRejected:boolean = false;
  providerReviews:any;
  isSelfieUploaded:boolean = false;
  isIDUploaded:boolean = false;
  totalReviews:number = 0;
  isFromAllCustomers:boolean = false;
  userReviews:any = {
    TaskCompletedCount: 0,
  completedPercentage: "0"
  };
  isUpdatePhone:boolean = false;
  isUserBlocked:boolean = false;
  @Input() childID: string;
  @Output() closeEvent = new EventEmitter();
  constructor(private adminService:AdminService, private activatedRoute:ActivatedRoute, private fb:FormBuilder,
    private dialog:MatDialog , private snackBar:MatSnackBar) { }

  ngOnInit() {
    this.onLoad()
  }
  ngOnChanges(changes: SimpleChanges){
    this.id = this.childID;
    this.isFromAllCustomers = true
    this.fetchData();
  }
  onLoad(){
    this.baseUrl = this.adminService.baseUrl
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      //log the entire params object
    if(params && params['id']){
      this.id = params['id'];
      this.fetchData()
    }
   });
  }
  closeDetails(){
    this.isFromAllCustomers = false;
    this.closeEvent.emit(false);
  }
  blockOrUnBlock(){
    let obj = {
      customerID : this.UserDetails.userID,
      "isBlocked": !this.isUserBlocked
    }
    this.adminService.showLoader.next(true);
    let token = sessionStorage.getItem('token');
    this.adminService.blockUnBlock(obj,token).subscribe((posRes)=>{
      if(posRes.response == 3){
        this.adminService.showLoader.next(false);
        this.openSnackBar(posRes.message,"");
        this.isUserBlocked = !this.isUserBlocked;
      }else{
        this.openSnackBar(posRes.message,"")
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"");
      if(err.error instanceof Error){
        console.warn("Client Side Error",err.error);
      }else{
        console.warn("Server Side Error",err.error);
      }
    })
  }
  fetchData() {
    this.adminService.showLoader.next(true);
    let id = { "userID": this.id }
    let token = sessionStorage.getItem('token')
    this.adminService.fetchUserDetails(id,token).subscribe((posRes) => {
      console.log("PosREs ",posRes);
      
      if (posRes.response == 3) {
        this.UserDetails = posRes.userInfo[0]
        console.log(this.UserDetails);
        this.isUserBlocked = this.UserDetails.isUserBlocked
        if(this.UserDetails.accountVerificationStatus == "Verified" || this.UserDetails.accountVerificationStatus == "Rejected"){
          this.isAccountVerified = true;
        }else{
          this.isAccountVerified = false;
        }
        this.asTasker = this.UserDetails.completeTask;
        this.asPoster = this.UserDetails.postTask;
        this.bankDetails = this.UserDetails.BankAccountDetailes;
        this.accountData = this.UserDetails.accountData;
        this.image = this.baseUrl+ this.UserDetails.profilePic;
        this.providerReviews = posRes.asAProvider;
        this.posterReviews = posRes.asAPoster;
        if(this.UserDetails.gallery.length != 0){
          this.UserDetails.gallery.forEach((val,index)=>{ 
         if(val.substring(val.lastIndexOf('.')+1) !== 'mp4'){
          this.gallery.push(val);
         }
          })
        }
         this.skills = this.UserDetails.Settings[0].skills;
         let event = {
          value : "tasker"
        }
        this.changeView(event);
      }else{
        this.adminService.showLoader.next(false);
        alert(posRes.message);
      }
    }, (err: HttpErrorResponse) => {
      this.adminService.showLoader.next(false);
      if (err.error instanceof Error) {
        console.log("CSE", err.message);
      } else {
        console.log("SSE", err.message);
      }
    })
  }
  editNumber(){
    this.isUpdatePhone = true;
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  editPhoneNumber(){
    
    let formData = new FormData()
    formData.append('userID',this.id);
    formData.append('phoneNumber',this.UserDetails.phoneNumber);
    let token = sessionStorage.getItem('token');
    this.adminService.updateMobileNumber(formData,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      this.isUpdatePhone = false;

      if(posRes.response == 3){
        this.openSnackBar(posRes.message,"")
        
      }else{
        this.openSnackBar(posRes.message,"")
      }
    },(err:HttpErrorResponse)=>{
      if(err.error instanceof Error){
        this.adminService.showLoader.next(false);
        this.openSnackBar(err.message,"")
        console.log("CSE",err.message);
      }else{
        console.log("SSE",err.message);
        
      }
    })
    
  }
  viewReviews(){
    let obj = {
      provider: this.providerReviews,
      poster : this.posterReviews,
    }
    let dialogRef = this.dialog.open(ReviewModalComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })
  }
  verify(){
    this.adminService.showLoader.next(true);
    let obj ={
      "userID": this.UserDetails.userID,
      "isVerified":"Verified",
      "reason":""
    }
    let token = sessionStorage.getItem('token');
    this.adminService.verifyCustomer(obj,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        let obj = {
          type: "verified"
        }
        let dialogRef = this.dialog.open(AccountVerificationModalComponent,{
          panelClass:'col-md-4',
          hasBackdrop : true,
          disableClose: true,
          data : obj
        })
        dialogRef.afterClosed().subscribe(res=>{
          if(!res){
            this.fetchData();
          }
        })
        
      }else{
        alert(posRes.message)
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        console.warn("Client Error",err.error);
      }else{
        console.warn("Server Error",err.error);
      }
    })
  }
 
  reject(){
    let obj = {
      type: "unVerified"
    }
    let dialogRef = this.dialog.open(AccountVerificationModalComponent,{
      panelClass:'col-md-3',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })
    dialogRef.afterClosed().subscribe(res=>{
     if(res && res.reason){
      this.adminService.showLoader.next(true);
      let obj ={
        "userID": this.UserDetails.userID,
        "isVerified":"Rejected",
        "reason":res.reason
      }
      let token = sessionStorage.getItem('token');
      this.adminService.verifyCustomer(obj,token).subscribe((posRes)=>{
        this.adminService.showLoader.next(false);
        if(posRes.response == 3){
          this.fetchData();
        }else{
          alert(posRes.message)
        }
      },(err:HttpErrorResponse)=>{
        this.adminService.showLoader.next(false);
        if(err.error instanceof Error){
          console.warn("Client Side Error",err.error)
        }else{
          console.warn("Server side Error",err.error)
        }
      })
     }
    })
  }
  changeView(event){
    if(event.value == "poster"){
      this.asPoster = true
      if(this.posterReviews && this.posterReviews.rating5){
        this.userReviews = this.posterReviews.posterTaskCompletedDetails;
        let one = this.posterReviews.rating1.length
        let two = this.posterReviews.rating2.length
        let three = this.posterReviews.rating3.length
        let four = this.posterReviews.rating4.length
        let five = this.posterReviews.rating5.length
        this.totalReviews = one + two + three + four + five;
      }else{
        this.totalReviews = 0;
        this.userReviews = {
          TaskCompletedCount: 0,
completedPercentage: ""
        }
      }
    }else{
     this.asPoster = false;
     if(this.providerReviews && this.providerReviews.rating5){
  
setTimeout(()=>{
  this.userReviews = this.providerReviews.providerTaskCompletedDetails;
},100)
let one = this.providerReviews.rating1.length
let two = this.providerReviews.rating2.length
let three = this.providerReviews.rating3.length
let four = this.providerReviews.rating4.length
let five = this.providerReviews.rating5.length
      this.totalReviews = one + two + three + four + five;
    }else{
      this.totalReviews = 0;
      this.userReviews = {
        TaskCompletedCount: 0,
completedPercentage: ""
      }
    }
    }
    this.adminService.showLoader.next(false);
  }
}
