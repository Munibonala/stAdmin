import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomerDetailsComponent } from '../customer-details/customer-details.component';

@Component({
  selector: 'app-account-verification-modal',
  templateUrl: './account-verification-modal.component.html',
  styleUrls: ['./account-verification-modal.component.css']
})
export class AccountVerificationModalComponent implements OnInit {
isVerifiedPage:boolean = false;
reasonForm:FormGroup;
  constructor(private dialogRef: MatDialogRef<CustomerDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb:FormBuilder) { }

  ngOnInit() {
    this.reasonForm = this.fb.group({
      reason:["",Validators.required]
    })
    if(this.data.type =="verified"){
      this.isVerifiedPage = true;
      setTimeout(() => {
        this.dialogRef.close(false)
      }, 2000);
    }else{
      this.isVerifiedPage = false;
    }
  }
  close(){
this.dialogRef.close(false)
  } 
   submit(){
    this.dialogRef.close(this.reasonForm.value)
  }
}
