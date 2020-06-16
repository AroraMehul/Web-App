/** Angular Imports */
import { Component, OnInit } from '@angular/core';
import { CriteriaDetailsService } from './criteriadetails.service';
import { Router } from '@angular/router';

/**
 * Criteria component.
 */
@Component({
  selector: 'mifosx-criteriadetails',
  templateUrl: './criteriadetails.component.html',
  styleUrls: ['./criteriadetails.component.scss']
})
export class CriteriadetailsComponent implements OnInit {

  public dataSource = [];
  public displayedColumns: string[] = ['Feature',
  'Category', 'Product', 'DataSource', 'SqlApi', 'Key'];

  constructor(private _criteriaService: CriteriaDetailsService,private router: Router) { }

  ngOnInit() {
    const allCriterias = (data) => {
      let res = []
      for (let x of data){
        res.push(JSON.parse(x));
      }

      this.dataSource = res;
    };
    this._criteriaService.getAllCriterias(allCriterias);
  }

  public getRecord(row){
    this.router.navigate(['criteria/'+row.id]);
  }

}
