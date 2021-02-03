import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlCustomersComponent } from '../al-customers/al-customers.component';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  headings:string = "Customers Filter";
  filterForm:FormGroup;
  filtercustomer:string= "All";
filterOption:string = "All";
baseUrl:string="";
jobs:any = [];
taskStatus:string = "";
customerObj:any;
  constructor(private dialogRef: MatDialogRef<AlCustomersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb:FormBuilder) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      dateRange: [null]
    })
  }
  closeTab(){
    this.dialogRef.close();
  }
  changeView(event){
    this.filtercustomer = event.value;
    }
    showOnly(text){
      this.filterOption = text; 
    }
    getFilteredTask(){
      if(this.filterForm.value.dateRange != null){
        console.log(new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0,0),new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,100));
        
        let frmDate = new Date(this.filterForm.value.dateRange[0]).getTime();
        let toDate = new Date(this.filterForm.value.dateRange[1]).getTime();
          frmDate = new Date(this.filterForm.value.dateRange[0]).setHours(0,0,0,0);
         toDate = new Date(this.filterForm.value.dateRange[1]).setHours(23,59,59,999);
        this.customerObj = {
          type : this.filtercustomer,
          "sortBy":this.filterOption,
        pageNo:"1",
        size:"60",
        "fromdate": ""+ frmDate,
        "todate":""+ toDate,
        }
        this.dialogRef.close(this.customerObj);
      }else{
        this.customerObj = {
          type : this.filtercustomer,
          "sortBy":this.filterOption,
          pageNo:"1",
          size:"90"
        };
        this.dialogRef.close(this.customerObj);
      }
    }
}
