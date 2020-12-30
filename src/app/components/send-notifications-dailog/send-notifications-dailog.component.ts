import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AdminService } from 'src/app/admin.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import {MatAutocompleteSelectedEvent, MatChipInputEvent} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-send-notifications-dailog',
  templateUrl: './send-notifications-dailog.component.html',
  styleUrls: ['./send-notifications-dailog.component.css']
})
export class SendNotificationsDailogComponent implements OnInit {
  options:Array<any> = ["All","Only Providers","Only Customers","Selected Customers"];
  notificationForm:FormGroup;
  type:string = "All";
  isSelectedType:boolean = false;
  userIdArray:Array<any> = [];
  selectedIDArray:Array<any> = [];
  showAutoComplete:boolean = false;
  // Autocomplete
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  userIdCtrl = new FormControl();

  filteredFruits: Observable<any[]>;
  @ViewChild('fruitInput',{static:false}) fruitInput: ElementRef;
  constructor(private dialogRef: MatDialogRef<NotificationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb:FormBuilder, private adminService:AdminService,
    private snackBar:MatSnackBar) {
      this.filteredFruits = this.userIdCtrl.valueChanges.pipe(
        startWith(null),
        map((id: string | null) => id ? this.filter(id) : this.userIdArray.slice()));
     }

  ngOnInit() {
    this.notificationForm = this.fb.group({
      userID:["enquiry@startasker.com"],
      userIDS:[""],
      title:["",Validators.required],
      Content:["",Validators.required]
    })
  }
  closeTab(){
this.dialogRef.close()
  }
  
  sendNotifications(){
    this.adminService.showLoader.next(true);
    if(this.showAutoComplete){
      this.notificationForm.patchValue({
        userIDS:this.selectedIDArray
      })
    }else{
      this.notificationForm.patchValue({
        userIDS:this.userIdArray
      })
    }
    console.log(this.notificationForm.value);
    let token =sessionStorage.getItem('token')
    this.adminService.sendNotifications(this.notificationForm.value,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.openSnackBar(posRes.message,"");
        this.dialogRef.close(true);
      }else{
        this.dialogRef.close(false);
        this.openSnackBar(posRes.message,"");
      }
    }, (err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"");
      this.dialogRef.close(false);
      if(err.error instanceof Error){
        console.warn("Client Error",err.message);
      }else{
        console.warn("Server Error",err.message);
      }
    })
  }
   //message alerts showing
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 3000
  });
}
  changeSelection(event){
    this.adminService.showLoader.next(true);
    this.isSelectedType = false;
    if(event.value == "All"){
      this.type = "All";
    };
    if(event.value == "Only Providers"){
      this.type = "Tasker"
    };
    if(event.value == "Only Customers"){
      this.type = "Poster";
    };
    if(event.value == "Selected Customers"){
      this.type = "All";
    }else{
      this.showAutoComplete = false;
    }
    let obj = {
      type : this.type
    }
    let token = sessionStorage.getItem('token');
    this.adminService.fetchUserIDS(obj,token).subscribe((posRes)=>{
      this.adminService.showLoader.next(false);
      if(posRes.response == 3){
        this.userIdArray = posRes.customersData.userIDs;
        this.isSelectedType = true;
        if(event.value == "Selected Customers"){
          this.showAutoComplete = true;
        }else{
          this.showAutoComplete = false; 
        }
        console.log(this.userIdArray);
      }else{
        this.openSnackBar(posRes.message,"");
        this.dialogRef.close(false)
      }
    },(err:HttpErrorResponse)=>{
      this.adminService.showLoader.next(false);
      this.openSnackBar(err.message,"");
      console.warn("Error",err.error);
      
    })
  }
  // AutoComplete code
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.selectedIDArray.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.userIdCtrl.setValue(null);
  }
  remove(id: any): void {
    const index = this.selectedIDArray.indexOf(id);
    if (index >= 0) {
      this.selectedIDArray.splice(index, 1);
    }
  }

  filter(name: string) {
    return this.userIdArray.filter(id =>
        id.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedIDArray.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.userIdCtrl.setValue(null);
  }
}
