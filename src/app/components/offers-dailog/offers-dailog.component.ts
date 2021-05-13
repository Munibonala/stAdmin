import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';

@Component({
  selector: 'app-offers-dailog',
  templateUrl: './offers-dailog.component.html',
  styleUrls: ['./offers-dailog.component.css']
})
export class OffersDailogComponent implements OnInit , AfterViewInit {
  baseUrl:string = "";
  headings:string = "Offers"
  offers:Array<any> = [];
  scrollContainer:any;
  isEditing:boolean = false;
  isUpdated:boolean = false;
  messageIndex:number = 0;
  editCommentDetails:string = "";
  
@ViewChild('mainScroll', { static: false }) myScroll: ElementRef;
  constructor(private dialogRef: MatDialogRef<any>, private adminService:AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any,private router:Router,private dialog:MatDialog,
    private snackBar:MatSnackBar ) { }

  ngOnInit() {
    this.baseUrl = this.adminService.baseUrl;
    console.log("Offers",this.data);
    this.offers = this.data.offers.authorMessages
  }
  closeTab(){
    this.dialogRef.close(this.isUpdated)
  }
   //message alerts showing
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 3000
    });
  }
  ngAfterViewInit() {
    this.scrollContainer = this.myScroll.nativeElement;
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    this.scrollToBottom()
  }
  scrollToBottom(): void {
    if (this.scrollContainer.offsetHeight + this.scrollContainer.scrollTop >= this.scrollContainer.scrollHeight) {
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    }
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    }
  deleteComment(message,i){
    // if(this.offers.length == 1){
    //   this.openSnackBar("You can update this message","")
    //   return;
    // }
    let obj = {
      "postID":this.data.postID,
    "offeredUserID" : this.data.offers.offeredUserID,
	"userID" : message.userID,
    "message" : message.message,
    "timeStamp" : message.timestamp
    }
let token = sessionStorage.getItem('token');
this.adminService.deleteChatMessages(obj,token).subscribe((posRes)=>{
if(posRes.response == 3){
  this.isUpdated = true;
  this.offers.splice(i,1)
  this.openSnackBar(posRes.message,"");
}else{
  this.openSnackBar(posRes.message,"");
  this.dialogRef.close(this.isUpdated);
}
},(err:HttpErrorResponse)=>{
  this.openSnackBar(err.message,"");
  this.dialogRef.close(this.isUpdated);
})
  }
  editComment(index,comment){
    this.isEditing = true;
    this.messageIndex = index;
    this.editCommentDetails = comment;
    console.log(this.editCommentDetails);
    this.scrollToBottom();
  }
  sendEdited(){
    this.isEditing = false;
    let obj = {
      "postID":this.data.postID,
    "offeredUserID" : this.data.offers.offeredUserID,
	"userID" : this.offers[this.messageIndex].userID,
    "message" : this.offers[this.messageIndex].message,
    "timeStamp" : this.offers[this.messageIndex].timestamp
    }
console.log("Message",obj);
let token = sessionStorage.getItem('token');
this.adminService.updateChatMessages(obj,token).subscribe((posRes)=>{
if(posRes.response == 3){
  this.isUpdated = true;
  this.openSnackBar(posRes.message,"");
}else{
  this.openSnackBar(posRes.message,"");
  this.dialogRef.close(this.isUpdated);
}
},(err:HttpErrorResponse)=>{
  this.openSnackBar(err.message,"")
  this.dialogRef.close(this.isUpdated);
})
  }
  showUserProfile(id){
this.router.navigate(['admin','customer',id]);
this.dialogRef.close()
  }
}
