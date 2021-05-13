import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin.service';
import { CouponComponent } from '../coupon/coupon.component';

@Component({
  selector: 'app-hire-providers',
  templateUrl: './hire-providers.component.html',
  styleUrls: ['./hire-providers.component.css']
})
export class HireProvidersComponent implements OnInit {
  bookingFee:number
  total:number = 0;
  offers:Array<any>= []
  baseUrl:string= "";
  user:any;
  txnForm:FormGroup;
  taskPrice:number = 0;
  isCouponApplied:boolean = false;
  couponCode:any = {
    couponAmount: "",
    couponCode: ""
  }
  constructor(private dialogRef: MatDialogRef<any>, private adminService:AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,private fb :FormBuilder, private snackBar:MatSnackBar, private dialog:MatDialog) { }

  ngOnInit() {
    this.txnForm = this.fb.group({
      txnID :["",Validators.required],
      orderNum: ["",Validators.required]
    })
    this.baseUrl = this.adminService.baseUrl;
    this.offers = this.data.offers;
    this.offers = this.offers.filter(val=>{
      return !val.isTaskerHired
    })
    
    this.offers.forEach(val=>{
      this.total += val.budget;
      this.taskPrice +=val.budget;
    })
  }
  removeOffer(index){
    if(this.offers.length >= 2){
      this.taskPrice -= this.offers[index].budget
     this.total -= this.offers[index].budget;
      this.offers.splice(index,1);
    }
  }
  removeCoupon(coupon){
    this.total += parseInt(this.couponCode.couponAmount)
    this.couponCode.couponAmount = "";
    this.couponCode.couponCode = ""
    this.isCouponApplied = false;
  }
  showCoupons(){
    if(this.taskPrice >= 50){
      let dialogRef = this.dialog.open(CouponComponent,{
        panelClass: 'col-md-4',
        hasBackdrop: true,
        disableClose: true,
        data: this.data.coupons
      })
      dialogRef.afterClosed().subscribe(res=>{
        if(res != null){
          this.total -= parseInt(res.couponAmount)
          this.isCouponApplied = true;
          this.couponCode.couponAmount = res.couponAmount;
          this.couponCode.couponCode = res.couponCode;
          
        }else{
          this.isCouponApplied = false;
        }
      })
    }else{
    this.openSnackBar("Task price should be minimum RM50 to use this coupons.","")
    }
  }
  closeTab(){
    this.dialogRef.close(false);
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  submit(){
    if(!this.txnForm.valid){
      this.openSnackBar("Enter Order Number/TxnId","")
      return
    }
    let obj = {
      isCouponApplied: this.isCouponApplied,
      couponObj : this.couponCode,
      offers: this.offers,
      budjet : this.total,
      txnValue: this.txnForm.value
    }
    this.dialogRef.close(obj);
  }
}
