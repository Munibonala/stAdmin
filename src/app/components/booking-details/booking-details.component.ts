import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrls: ['./booking-details.component.css']
})
export class BookingDetailsComponent implements OnInit {
  rawData:any;
  id:string;
  taskUserInfo:any;
  image:string;
  date:any;
  routeSub:any;
  one:boolean = true;
  two:boolean = false;
  three:boolean = false;
  four:boolean = false;
  five:boolean = false;
  isPosterCompletedTask:boolean = false;
  public baseUrl:string;
  selectedTaskers:Array<any> = [];
  totalSubscribe:any;
  bookedTaskers:Array<any> = [];
  totalAmount:number = 0;
  isCouponApplied:boolean = false;
  taskTotal:number = 0;
  isFromAllBookings:boolean = false;
  @Input() childID: string;
  @Output() closeEvent = new EventEmitter();
  constructor(private adminService:AdminService,private router:Router, private activatedRoute:ActivatedRoute,
    private snackBar:MatSnackBar) { }

  ngOnInit() {
    this.baseUrl = this.adminService.baseUrl;
    this.routeSub = this.activatedRoute.params.subscribe(params => {
      //log the entire params object
      this.id = params['id'];
      this.getTaskDetails()
   }); 
  }
  ngOnChanges(changes: SimpleChanges){
    this.id = this.childID;
    this.isFromAllBookings = true
    this.getTaskDetails();
  }
  closeDetails(){
    this.isFromAllBookings = false;
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
  showUser(user){
    this.adminService.showLoader.next(true);
    this.router.navigate(['admin','customer',user]);
  }
  getTaskDetails(){
    this.totalAmount = 0;
    this.taskTotal = 0;
    this.isCouponApplied = false;
    this.adminService.showLoader.next(true);
    this.two = false;
    this.three = false;
    this.four = false;
    this.five = false;
  let obj = {
    bookingID: this.id
  }
  this.selectedTaskers =[];
  this.adminService.showLoader.next(true);
  let token = sessionStorage.getItem('token');
  this.totalSubscribe = this.adminService.bookingDetails(obj,token).subscribe((posRes)=>{
    console.log("Booking Job DETAILS",posRes.bookingData);
    this.adminService.showLoader.next(false);
    if(posRes.response == 3){
      this.rawData = posRes.bookingData;
      this.image = this.baseUrl+'/'+this.rawData.customerProfilePic;
      this.totalAmount = this.rawData.taskTotalBudget
      if(this.rawData && (this.rawData.couponDiscount !='')){
        this.totalAmount -= parseFloat(this.rawData.couponDiscount);
        this.isCouponApplied = true;
        this.taskTotal = this.rawData.taskTotalBudget - parseFloat(this.rawData.couponDiscount);
      }
      this.totalAmount = this.totalAmount* 80/100
     if(this.rawData.userID){
      this.bookedTaskers = this.rawData.bookedTaskers;
      
      let array = [];
    array =  this.bookedTaskers.filter(val=>{
        return val.isCustomerCompletedTask === false;
      });
      if(array.length >= 1){
        this.isPosterCompletedTask = false;
        let i = -1;
        i = this.bookedTaskers.findIndex(x=>{
          return x.isTaskerCompletedTask == false;
        })
        if(i == -1){
          this.one = true;
          this.two = true;
        }else{
          this.two = false;
        }
      }else{
        this.isPosterCompletedTask = true;
        this.one = true;
           this.two = true;
           this.three = true;
           this.four = true;
      }
     }
  
    }else{
      alert(posRes.message)
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
  //message alerts showing
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  releasePayment(user){
    console.log(user);
    let obj = {
      offeredUserID: user.offeredUserID,
      bookingID: this.id
    }
    let token = sessionStorage.getItem('token')
    this.adminService.showLoader.next(true);
    this.adminService.releasePaymentToProvider(obj,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.openSnackBar(posRes.message,"");
        this.getTaskDetails()

      }else{
        this.openSnackBar(posRes.message,"");
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.error,"");
      if(err.error instanceof Error){
        console.warn("Client Side Error",err.error);
      }else{
        console.warn("Server side Error",err.error)
      }
    })
  }
}
