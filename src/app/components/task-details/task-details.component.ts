import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommentsDailogComponent } from '../comments-dailog/comments-dailog.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { OffersDailogComponent } from '../offers-dailog/offers-dailog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ImgPreviewComponent } from '../img-preview/img-preview.component';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';
import { HireProvidersComponent } from '../hire-providers/hire-providers.component';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit ,OnChanges {
  rawData:any;
  id:string;
  taskUserInfo:any;
  image:string;
  date:any;
  routeSub:any;
  txnValue:any;
  one:boolean = true;
  public baseUrl:string;
  comments:Array<any> = [];
  offers:Array<any> = [];
  assigned:Array<any> = [];
  couponObj:any ;
  isUserDetails:boolean = false;
  customerID:string = "";
  @Input() childID: string;
  @Output() closeEvent = new EventEmitter();
  isFromAllTask:boolean = false;
  attachments:Array<any> = [];
  couponAmount:string = '0';
  amount:number = 0;
  userCoupons:any = []
  constructor(private adminService:AdminService,private router:Router, private activatedRoute:ActivatedRoute,
    private dialog:MatDialog, private snackBar : MatSnackBar) { }

  ngOnInit() {
   this.onLoad()
  }
  onLoad(){
    this.baseUrl = this.adminService.baseUrl;
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      //log the entire params object
     if(params && params['id']){
      this.id = params['id'];
      this.getTaskDetails()
     }
   }); 
  }
  ngOnChanges(changes: SimpleChanges){
    this.isFromAllTask = true
    this.id = this.childID;
    this.getTaskDetails();
  }
  closeDetails(){
    this.isFromAllTask = false;
    this.closeEvent.emit(true)
  }
  getColors(status){
    switch (status){
      case "Open":
        return '#09A804';
        case "Assigned": return '#FF870E';
        case "Completed": return '#Fa0e0e';
    }
  }
  showGallery(){
    let data = {
      isFromGallery : false,
      images : this.attachments
    }
    let dialogRef = this.dialog.open(ImgPreviewComponent,{
      panelClass: 'col-md-4',
      hasBackdrop: true,
      disableClose:false,
      width :'40rem',
      data : data
    })
  }
  getTaskDetails(){
    let obj = {
      userID: this.id
    }
    this.adminService.showLoader.next(true);
   this.adminService.getMyTasks(obj).subscribe((posRes)=>{
    this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.rawData = posRes.jobsData[0];
        console.log("data",this.rawData);
        if(this.rawData && this.rawData.userInfo){
          this.taskUserInfo = this.rawData.userInfo;
          this.getUserDetails();
          this.comments = this.rawData.comments;
          this.offers = this.rawData.offers;
          this.assigned = this.offers.filter(val=>{
            return val.isTaskerHired && !val.isTaskerWithDraw
          })
          if(this.rawData.attachments && this.rawData.attachments.length){
             this.rawData.attachments.forEach(val=>{
              return this.attachments.push(this.baseUrl+val);
            })
            console.log("Attachments",this.attachments)
          }
          if(this.taskUserInfo.profilePic != ""){
            this.image = "https://stagingapi.startasker.com"+this.taskUserInfo.profilePic
          }
        }
        if(this.rawData.budget.budgetType.Total == false){
          let num:number = parseInt(this.rawData.budget.Hours) 
          this.rawData.budget.budget = num * this.rawData.budget.pricePerHour;
        }
   
   this.date = new Date(posRes.jobsData[0].postedDate * 1)
    
      }else{
        this.openSnackBar(posRes.message,"")
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        console.warn("Client Error",err.error)
      }else{
        console.warn("Server Error",err.error)
      }
      
    })
  }
  getUserDetails(){
    let obj = {
      userID : this.rawData.userID
    }
this.adminService.getUserDetails(obj).subscribe((posRes)=>{
  if(posRes.response == 3){
    this.userCoupons = posRes.customerInfo[0].coupons
  }
},(err:HttpErrorResponse)=>{})
  }
  userDetails(id){
    this.adminService.showLoader.next(true);
    this.isUserDetails = true;
    this.customerID = id;
     }
     receiveMessage(event){
      this.isUserDetails = event;
     }
  openPrivateChat(offer){
    console.log(offer.authorMessages);
    let obj = {
      offers : offer,
      postID : this.rawData.postID
    }
    let dialogRef = this.dialog.open(OffersDailogComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })  
    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.getTaskDetails()
      }
    })
  }
  openComments(){
    let obj = {
      offers : this.comments,
      postID : this.rawData.postID
    }
    let dialogRef = this.dialog.open(CommentsDailogComponent,{
      panelClass:'col-md-4',
      hasBackdrop : true,
      disableClose: true,
      data : obj
    })
    dialogRef.afterClosed().subscribe(res=>{
      this.getTaskDetails()
    })
  }
  openOffers(){
    this.txnValue = {}
    if(this.offers.length){
      let obj = {
        offers : this.offers,
        postID : this.rawData.postID,
        taskTitle: this.rawData.postTitle,
        coupons : this.userCoupons
      }
      let dialogRef = this.dialog.open(HireProvidersComponent,{
        panelClass:'col-md-4',
        hasBackdrop : true,
        disableClose: true,
        data : obj
      })
      dialogRef.afterClosed().subscribe(res => {
        if (res !== false) {
          this.txnValue = res.txnValue
          this.amount = 0;
          console.log("Selected Offers", res);
          let bookedTaskers = [];
          res.offers.forEach(val => {
            let obj = {
              offeredUserID: val.offeredUserID,
              offeredUserName: val.authorName,
              budget: val.budget,
              offeredUserProfilePic: val.authorProfilePic,
              isCustomerCompletedTask: false,
              isTaskerCompletedTask: false,
              paymentStatusToProviderByAdmin: false,
              isWithDraw: false,
              ratingsToProvider: false,
              ratingsToPoster: false
            }
            this.amount += val.budget;
            bookedTaskers.push(obj);
          });
          this.couponAmount = '0'
          if(res.isCouponApplied){
            this.amount -= parseInt(res.couponObj.couponAmount);
            this.couponAmount = "-"+res.couponObj.couponAmount;
          }
          this.couponObj = res.couponObj;
          // localStorage.setItem('coupon',JSON.stringify(res.couponObj))
          // localStorage.setItem('selectedUsers', JSON.stringify(bookedTaskers));
           this.hireTaskers(bookedTaskers)
        }
      })
    }else{
      this.openSnackBar("No providers to hire..!","")
    } 
  }
  // Hire Taskers
  
  hireTaskers(details) {
    let coupon = this.couponObj
    let PaymentID = "Pid" + new Date().getTime();
    let payLoad = {
      "TxnMessage" : "MAYBANK2U|YEOH HUI LENG|Transaction Successful|00|",
      "PymtMethod" : "DD",
      "TransactionType" : "SALE",
      "TxnID" : this.txnValue.txnID,
      "HashValue2" : "755856bfa75ec9b71dbbfa7a17c3a08a8add3ed46d39297f1e141ae2418e184c",
      "OrderNumber" : this.txnValue.orderNum,
      "Amount" : ""+ this.amount.toFixed(2),
      "ServiceID" : "CLS",
      "HashValue" : "0b9a49f66e669a552c32e93711c7c7293a4c3c2eace2a633959ed257efbcfbee",
      "paymentID" : PaymentID,
      "CurrencyCode" : "MYR",
      "TxnStatus" : "0"
}
    
    let bookingID = "STR" + new Date().getTime()
    let hireTaskObj = {
      describeTaskInDetails: this.rawData.describeTaskInDetails,
      taskDate: this.rawData.taskDate,
      attachments: this.rawData.attachments,
      taskTotalBudget: this.rawData.budget.budget,
      mustHaves: this.rawData.mustHaves,
      convenientTimings: this.rawData.convenientTimings,
      userID: this.rawData.userID,
      paymentID: PaymentID,
      bookingID: bookingID,
      postID: this.rawData.postID,
      customerProfilePic: this.rawData.userInfo.profilePic,
      location: this.rawData.location,
      loc: this.rawData.loc,
      serviceCategory: this.rawData.category.categoryName,
      taskTitle: this.rawData.postTitle,
      customerName: this.rawData.userInfo.firstName,
      paymentStatus: "Completed",
      bookedTaskers: details,
      "couponCode": coupon.couponCode,
      "couponAmount": coupon.couponAmount,
      "couponDiscount": this.couponAmount,
      paymentData: payLoad
    }
    console.log("Hire Tasker Object",hireTaskObj);
    
    let token = sessionStorage.getItem('token')
    
    this.adminService.hireProviders(hireTaskObj, token).subscribe((posRes) => {
      if (posRes.response == 3) {
        this.getTaskDetails()
        this.openSnackBar(posRes.message, "")
      } else {
        this.openSnackBar(posRes.message, "")
      }
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        console.warn("CSE", err.error)
      } else {
        console.warn("SSE", err.message)
      }
    })
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  deleteOffers(offer,i){
    let obj = {
      "postID":this.rawData.postID,
      "offeredUserID" : offer.offeredUserID
    }
    let message = `Do you want to delete this Offer ?` 
    let dailogRef = this.dialog.open(DeleteDailogComponent, {
      panelClass: 'col-md-4',
      hasBackdrop: true,
      disableClose:true,
      data : message
    });
    dailogRef.afterClosed().subscribe(res=>{
      if(res){
        let token = sessionStorage.getItem('token');
      this.adminService.deleteOffer(obj,token).subscribe((posRes)=>{
        if(posRes.response == 3){
          this.openSnackBar(posRes.message,"")
          this.offers.splice(i,1);
        }else{
          this.openSnackBar(posRes.message,"")
        }
      },(err:HttpErrorResponse)=>{
        this.openSnackBar(err.message,"")
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
