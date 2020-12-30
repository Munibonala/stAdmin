import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from 'src/app/admin.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.css']
})
export class ReferralsComponent implements OnInit {
  referralForm:FormGroup;
  referralData:Array<any> = [];
  jobObj:any;
  taskStatus:string = "All";
  pageNo:number = 1;
  totalPageCount:number = 0;
  debounceTime = null;
  testing:Array<any> = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,21]
  @ViewChild(CdkVirtualScrollViewport, { static: false }) viewPort: CdkVirtualScrollViewport;
  constructor(private fb:FormBuilder, private adminService:AdminService, private snackBar: MatSnackBar,
     private cd:ChangeDetectorRef) { }

  ngOnInit() {
    this.jobObj ={
      "type":this.taskStatus,
    "pageNo":""+this.pageNo,
    "size":"20",
    }
    this.referralForm = this.fb.group({
      dateRange:[null]
    })
    this.filterReferrals()
  }
  taskFilter(type){
    this.taskStatus = type;
    this.getFilters()
  }
  
  getFilters(){
    if(this.referralForm.value.dateRange != null){
      let frmDate = new Date(this.referralForm.value.dateRange[0]).getTime();
      let toDate = new Date(this.referralForm.value.dateRange[1]).getTime();
      //   frmDate = new Date(new Date(frmDate).toLocaleDateString()).getTime();
      //  toDate = new Date(new Date(toDate).toLocaleDateString()).getTime() + 86399900;
      this.referralData = [];
      this.pageNo = 1;
      this.jobObj = {
        type : this.taskStatus,
      pageNo:""+this.pageNo,
      size:"20",
      "fromdate": ""+ frmDate,
      "todate":""+ toDate,
      }
      this.filterReferrals();
    }else{
      this.referralData = [];
      this.pageNo = 1;
      this.jobObj = {
        type : this.taskStatus,
        pageNo:""+this.pageNo,
        size:"20"
      }
      this.filterReferrals()
    }
  }
  //message alerts showing
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
    // Vertual Scroll pagination
    onScrollEnd(){
      if(this.viewPort){
        this.viewPort.elementScrolled().subscribe(
          res => {
            
              clearTimeout(this.debounceTime);
          this.debounceTime = setTimeout(() => {
            if (
              (res as any).srcElement.scrollTop +
              (res as any).srcElement.offsetHeight >=
              (res as any).srcElement.scrollHeight   && this.totalPageCount > this.pageNo
            ) {
              console.log("View Port",this.viewPort)
              debugger;
              this.pageNo = this.pageNo + 1;
              this.filterReferrals()
            }
          }, 100)
          });
      }
    }
  filterReferrals(){
    this.adminService.showLoader.next(true);
    let token = sessionStorage.getItem('token')
    this.jobObj.pageNo = ""+ this.pageNo;
    this.adminService.getReferralData(this.jobObj,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.referralData = this.referralData.concat(posRes.FetchData);
        this.cd.detectChanges()
        this.totalPageCount = posRes.pages
        this.openSnackBar(posRes.message,"");
      }else{
        this.openSnackBar(posRes.message,"")
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      if(err.error instanceof Error){
        this.openSnackBar(err.message,"")
        console.warn("Server Error",err.error);
      }else{
        console.log("Client Error",err.error)
      }
    })
  }
  markAsPaid(refferal,i){
    this.adminService.showLoader.next(true);
let obj = {postID:refferal._id};
let token = sessionStorage.getItem('token');
this.adminService.makeAsPaid(obj,token).subscribe((posRes)=>{
  this.adminService.showLoader.next(false);
if(posRes.response == 3){
  this.referralData[i].isTransferStatus = true;
  this.openSnackBar(posRes.message,"");
}else{
  this.openSnackBar(posRes.message,"")
}
},(err:HttpErrorResponse)=>{
  this.adminService.showLoader.next(false);
  this.openSnackBar(err.message,"");
  if(err.error instanceof Error){
    this.openSnackBar(err.message,"");
    console.warn("Client Error",err.error);
  }else{
    console.warn("Server Error",err.error);
  }
})
  }
  // applyFilter(event){
  //   console.log(event);
    
  // }
}
