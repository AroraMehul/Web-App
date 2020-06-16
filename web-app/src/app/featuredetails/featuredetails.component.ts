/** Angular Imports */
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import { FeatureDetailsService } from './featuredetails.service';
import { Router } from '@angular/router';



@Component({
  selector: 'mifosx-featuredetails',
  templateUrl: './featuredetails.component.html',
  styleUrls: ['./featuredetails.component.scss']
})
export class FeaturedetailsComponent implements OnInit {

  displayedColumns: string[] = ['Feature', 'ValueType', 'DataType', 'Category', 'Status']
  public dataSource = [];
  constructor(private _featureService: FeatureDetailsService,private router: Router) { }

  ngOnInit() {
    this.dataSource = [];
    const allFeatures = (data) => {
      // console.log(JSON.stringify(data));
      let res = []
      for (let x of data){
        res.push(JSON.parse(x));
      }

      this.dataSource = res;
    }
    this._featureService.getAllFeatures(allFeatures);
  }

  public getRecord(row){
    this.router.navigate(['feature/'+row.id]);
  }

}

