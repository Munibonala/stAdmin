import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';

@Component({
  selector: 'app-offers-dailog',
  templateUrl: './offers-dailog.component.html',
  styleUrls: ['./offers-dailog.component.css']
})
export class OffersDailogComponent implements OnInit {
  baseUrl:string = "";
  headings:string = "Offers"
  offers:Array<any> = [];
  constructor(private dialogRef: MatDialogRef<any>, private adminService:AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,private router:Router,private dialog:MatDialog,
    private snackBar:MatSnackBar ) { }

  ngOnInit() {
    this.baseUrl = this.adminService.baseUrl;
    console.log("Offers",this.data);
    this.offers = this.data.offers
  }
  closeTab(){
    this.dialogRef.close()
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  deleteOffers(offer,i){
let obj = {
  "postID":this.data.postID,
  "offeredUserID" : offer.offeredUserID
}
let message = `Do you want to delete this Offer ?` 
let dailogRef = this.dialog.open(DeleteDailogComponent, {
  panelClass: 'col-md-4',
  hasBackdrop: true,
  disableClose:true,
  data : message
})
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
  showUserProfile(id){
this.router.navigate(['admin','customer',id]);
this.dialogRef.close()
  }
}
