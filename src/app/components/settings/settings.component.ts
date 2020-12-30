import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DeleteDailogComponent } from '../delete-dailog/delete-dailog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  category:Array<any> =[];
  catText:string = ""
  baseUrl:string;
  previewUrl:any;
  isFileUploaded:boolean = false;
  catForm:FormGroup;
  prizeForm:FormGroup;
  id:string = "";
  constructor(private adminService:AdminService,  private cd: ChangeDetectorRef, private fb:FormBuilder,
    private snackBar:MatSnackBar, private dialog:MatDialog) { }

  ngOnInit() {
    this.previewUrl ="../../../assets/Add_image.png";
    this.baseUrl = this.adminService.baseUrl;
    this.browseCategory();
    this.catForm = this.fb.group({
      categoryName:["",Validators.required],
      image:["",Validators.required]
    })
    this.prizeForm = this.fb.group({
      Setminimumtaskamount:["",[Validators.required,Validators.min(10)]],
      Setminimumwithdrawamount:["",[Validators.required,Validators.min(100)]],
      _id:[""]
    })
  }
  //message alerts showing
openSnackBar(message: string, action: string) {
  this.snackBar.open(message, action, {
    duration: 3000
  });
}
// Browse Category
browseCategory(){
  this.adminService.browseCategory().subscribe((posRes)=>{
    if(posRes.response == 3){
      this.category = posRes.categoriesList;
      this.prizeForm.patchValue({
        _id : posRes.isUpdate[0]._id,
        Setminimumtaskamount:posRes.isUpdate[0].amount.Setminimumtaskamount,
        Setminimumwithdrawamount: posRes.isUpdate[0].amount.Setminimumwithdrawamount
      })
      console.log("Category",this.prizeForm.value);
      
    }else{
      this.openSnackBar(posRes.message,"")
    }
  },(err:HttpErrorResponse)=>{
    if(err.error instanceof Error){
      console.warn("CSE",err.message);
    }else{
      console.warn("SSE",err.message);
      
    }
  })
}
addService(){
  let random ="Cat" + new Date().getTime();
  let text = this.catForm.value.categoryName;
  if(text != ""){
    let index = this.category.findIndex(val=>{
      let cat = val.categoryName.toLowerCase();
      return cat == text.toLowerCase();
    })
    if(index < 0){
      this.adminService.showLoader.next(true);
      let formData = new FormData();
      formData.append("categoryName",text);
      formData.append("image",this.catForm.value.image);
      let token = sessionStorage.getItem('token')
      this.adminService.settingsCategoryInsert(formData,token).subscribe((posRes)=>{
        this.adminService.showLoader.next(false);
        if(posRes.response == 3){
          this.openSnackBar(posRes.message,"");
          this.previewUrl ="../../../assets/Add_image.png";
          this.browseCategory();
          this.catForm.patchValue({
            categoryName: "",
            image : null
          })
        }else{
          this.catForm.patchValue({
            categoryName: "",
            image : null
          })
          this.openSnackBar(posRes.message,"");
        }
      },(err:HttpErrorResponse)=>{
        this.adminService.showLoader.next(false);
        this.openSnackBar(err.message,"");
        if(err.error instanceof Error){
          console.warn("Client Side Error", err.message);
        }else{
          console.warn("Server Error", err.message)
        }
      })
    }else{
      alert("Duplicates are not allowed..");
    }
  }
 
}
 //File Upload
 fileProgress(event) {
  let reader = new FileReader(); // HTML5 FileReader API
  let file = event.target.files[0];
  console.log("FIle",file);
  if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(file);
    // When file uploads set it to file formcontrol
    reader.onload = () => {
      this.previewUrl = reader.result;
      
      this.catForm.get('image').setValue(file);
      this.isFileUploaded = true;
    }
    // ChangeDetectorRef since file is loading outside the zone
    this.cd.markForCheck();
  }
}
deleteCat(data,i){ 
  let message = `Do you want to delete ${data.categoryName} category.` 
  let dailogRef = this.dialog.open(DeleteDailogComponent, {
    panelClass: 'col-md-4',
    hasBackdrop: true,
    disableClose:true,
    data : message
  })
  dailogRef.afterClosed().subscribe(res=>{
    if(res){
      this.adminService.showLoader.next(true);
      let obj = {
        categoryId : data.categoryId
      };
      let token = sessionStorage.getItem('token');
      this.adminService.deleteCategory(obj,token).subscribe((posRes)=>{
        this.adminService.showLoader.next(false);
        this.openSnackBar(posRes.message,"");
        this.category.splice(i,1)
      },(err:HttpErrorResponse)=>{
        this.adminService.showLoader.next(false);
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
updateAmount(){
  this.adminService.showLoader.next(true)
  let token = sessionStorage.getItem('token')
  this.adminService.updateAmount(this.prizeForm.value,token).subscribe((posRes)=>{
    this.adminService.showLoader.next(false);
    if(posRes.response == 3){
      this.openSnackBar(posRes.message,"");
      this.browseCategory();
    }else{
      this.openSnackBar(posRes.message,"");
    }
  },(err:HttpErrorResponse)=>{
    this.adminService.showLoader.next(false);
    this.openSnackBar(err.message,"")
    if(err.error instanceof Error){
      console.warn("Client Error",err.error);
    }else{
      console.warn("Server Error",err.error);
    }
  })
}
}
