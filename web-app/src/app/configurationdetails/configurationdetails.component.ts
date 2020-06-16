/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { ConfigDetailsService } from './configurationdetails.service.component';
import { Router } from '@angular/router';

/**
 * Configuration component. (by office)
 */
@Component({
  selector: 'mifosx-configurationdetails',
  templateUrl: './configurationdetails.component.html',
  styleUrls: ['./configurationdetails.component.scss']
})
export class ConfigurationdetailsComponent implements OnInit {


  public displayedColumns: string[] = ['Feature', 'Category', 'Product',
   'Weightage', 'Green', 'Amber', 'Red'];
  public dataSource = [];
  constructor(private _configDetails: ConfigDetailsService,private router: Router) { }

  ngOnInit() {

    const allConfigs = (data) => {
      let res = []
      for (let x of data){
        res.push(JSON.parse(x));
      }

      this.dataSource = res;
    }
    this._configDetails.getAllConfigs(allConfigs);
  }

  public getRecord(row){
    this.router.navigate(['configuration/'+row.id]);
  }
}
