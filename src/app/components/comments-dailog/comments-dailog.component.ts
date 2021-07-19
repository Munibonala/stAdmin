import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/admin.service';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';

@Component({
  selector: 'app-comments-dailog',
  templateUrl: './comments-dailog.component.html',
  styleUrls: ['./comments-dailog.component.css']
})
export class CommentsDailogComponent implements OnInit {
  baseUrl:string = "";
  headings:string = "Comments"
  comments:Array<any> = [];
  isEditing:boolean = false;
  commentIndex:number = null;
  postID:string = "";
  editCommentDetails:any = null;
  constructor(private dialogRef: MatDialogRef<any>, private adminService:AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any, private router:Router,private dialog:MatDialog,private snackBar:MatSnackBar ) { }

  ngOnInit() {
    this.baseUrl =this.adminService.baseUrl;
    this.comments = this.data.offers;
    this.postID = this.data.postID;
  }
  closeTab(){
    this.dialogRef.close();
  }
  editComment(index,comment){
    this.isEditing = true;
    this.commentIndex = index;
    this.editCommentDetails = comment;
  }
    //message alerts showing
    openSnackBar(message: string, action: string) {
      this.snackBar.open(message, action, {
        duration: 3000
      });
    }
  sendEdited(){
    this.isEditing = false;
    this.adminService.showLoader.next(true);
  let obj = {
    "postID":this.postID,
    "author_email" : this.editCommentDetails.author_email,
     "author_comment" : this.editCommentDetails.author_comment,
     comment_date : this.editCommentDetails.comment_date
  }
  let token = sessionStorage.getItem('token')
  this.adminService.ediComment(obj,token).subscribe((posRes)=>{
    this.adminService.showLoader.next(false);
    if(posRes.response == 3){
 this.openSnackBar(posRes.message,"")
      this.dialogRef.close(true);
    }else{
      this.openSnackBar(posRes.message,"")
    }
  },(err:HttpErrorResponse)=>{
    this.adminService.showLoader.next(false);
    this.openSnackBar(err.error,"")
    if(err.error instanceof Error){
      console.warn("Server Error",err.error);
    }else{
      console.warn("Client Error",err.error)
    }
  })
  }
  deleteComment(details,i){
    let obj = {
      author_email :  details.author_email,
      postID : this.data.postID
    }

    let message = `Do you want to delete this comment ?` 
    let dailogRef = this.dialog.open(DeleteDailogComponent, {
      panelClass: 'col-md-4',
      hasBackdrop: true,
      disableClose:true,
      data : message
    })
    dailogRef.afterClosed().subscribe(res=>{
    if(res){
      let token = sessionStorage.getItem('token');
      this.adminService.deleteComments(obj,token).subscribe((posRes)=>{
        this.comments.splice(i,1);
        alert("Comment Delated")
      },(err:HttpErrorResponse)=>{
  if(err.error instanceof Error){
    console.warn("Client Side Error",err.error)
  }else{
    console.warn("Server side Error",err.error)
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
