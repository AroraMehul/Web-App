/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute} from "@angular/router";
import { CriteriaService } from "./criteria.service";
import { MatTableDataSource } from "@angular/material";
import { IfStmt } from "@angular/compiler";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

/**
 * Create Criteria Component
 */
@Component({
  selector: "mifosx-criteria",
  templateUrl: "./criteria.component.html",
  styleUrls: ["./criteria.component.scss"],
})
export class CriteriaComponent implements OnInit {

  dataSource = ["XML", "JSON", "SQL"];

  productData = [];

  featureData = [];

  displayedColumns: string[] = ["criteria", "score"];
  dataTable: MatTableDataSource<CriteriaScoreElement>;

  public criteriaObject = {
    id : null,
    feature: "",
    category: "",
    product: "",
    datasource: "",
    keyvalue: "",
    sqlapi: "",
    scoreCriteria: [],
  };

  criteriaForm: FormGroup;

  errorFlag: boolean;
  constructor(private _criteriaService: CriteriaService, private router: Router, private route: ActivatedRoute, private _snackBar: MatSnackBar) {
    /**this.criteriaObject.scoreCriteria.push({
      criteria: "",
      score: "",
      id: null,
      errorflag: false,
    });*/
  }

  sourceChange($event) {
    if ($event.value === "SQL") {
      this.criteriaForm.get('keyvalue').disable();    
    } else {
      this.criteriaForm.get('keyvalue').enable();   
    }
  }

  ngOnInit() {

    let id = null;

    this.getFeatureCategory();
    this.readallproducts();

    console.log(this.criteriaObject.datasource === "SQL")

    this.criteriaForm = new FormGroup({
    'feature' : new FormControl(this.criteriaObject.feature, [Validators.required]),
    'category' : new FormControl({
    value: this.criteriaObject.category,
    disabled: true}
    , [Validators.required]),
    'product' : new FormControl(this.criteriaObject.product, [Validators.required]),
    'datasource' : new FormControl(this.criteriaObject.datasource, [Validators.required]),
    'keyvalue' : new FormControl({
    value: this.criteriaObject.keyvalue,
    disabled: this.criteriaObject.datasource === "SQL"}
    , []),
    'sqlapi' : new FormControl(this.criteriaObject.sqlapi, [Validators.required]),
    'scoreCriteria' : new FormControl(this.criteriaObject.scoreCriteria, [])
    });

    this.route.params.subscribe((params) => {
    id = params['id'];
    });
    if (id) {
      this.getById(id);
    }

  }

  public openSnackBar(message: string) {
    console.log(this);
    this._snackBar.open(message, "Close", {
      duration: 4000,
    });
  }

  addRow() {
    let setErrorFlag = false;
    for (let sc of this.criteriaObject.scoreCriteria) {
      if (!sc.criteria || !sc.score) {
        setErrorFlag = true;
        sc.errorflag = true;
      } else {
        sc.errorflag = false;
      }
    }
    if (!setErrorFlag) {
      this.criteriaObject.scoreCriteria.push({ criteria: "", score: "", id: null, errorflag: false });
    }
  }

  removeRow() {
    if (this.dataTable.data.length) {
      this.dataTable.data.pop();
    }
    this.dataTable.filter = "";
  }

  public readallproducts() {
    const errorCallBack = (data) => {
      this.openSnackBar("Problem Loading, Please Try Again");
    }

    const successcallback = (data) => {
      for (let pro of data) {
        this.productData.push(pro.name);
      }
    };
    this._criteriaService.readJSONfile(successcallback, errorCallBack);
  }
  public getFeatureCategory() {
    const errorCallBack = (data) => {
      this.openSnackBar("Problem Loading, Please Try Again");
    }
    const successcallback = (data) => {
      for (let feat of data) {
        let single = {
          id: JSON.parse(feat)["id"],
          feature: JSON.parse(feat)["feature"],
          category: JSON.parse(feat)["category"],
        };
        this.featureData.push(single);
      }
    };
    this._criteriaService.getCategoryFeature(successcallback, errorCallBack);
  }

  public onFeatureSelection() {
    let y = this.featureData.filter((feat) => feat.feature === this.criteriaObject.feature);
    this.criteriaObject.category = y[0].category;
  }

  public getById(id) {
    const errorCallBack = (data) => {
      this.openSnackBar("Problem Loading, Please Try Again");
    }
    const successcallback = (data) => {
      console.log(data);
      this.criteriaObject.id = data['id'];
      this.criteriaObject.feature = data['feature'];
      this.criteriaObject.category = data['category'];
      this.criteriaObject.product = data['product'];
      this.criteriaObject.datasource = data['datasource'];
      this.criteriaObject.keyvalue = data['keyvalue'];
      this.criteriaObject.sqlapi = data['sqlapi'];
      for(var _i = 0; _i < data['score'].length; _i++){
        this.criteriaObject.scoreCriteria.push({ criteria: data['criteria'][_i], score: data['score'][_i], id: data['id'], errorflag: false });
      }

      if (this.criteriaObject.datasource === "SQL") {
        this.criteriaForm.get('keyvalue').disable();    
      } else {
        this.criteriaForm.get('keyvalue').enable();   
      }
      console.log(JSON.stringify(this.criteriaObject));
    };
    this._criteriaService.getOneCriteria(id, successcallback, errorCallBack);
  }

  public submitCriteria() {

    const successcallback = (data) => {
      this.router.navigate(["scorecard"]);
    };

    const errorCallBack = (data) => {
      this.openSnackBar("Problem Submitting, Please Try Again");
    };
    console.log(JSON.stringify(this.criteriaObject));
    this._criteriaService.saveCriteria(this.criteriaObject, successcallback, errorCallBack);

    
    
  }
}

export interface CriteriaScoreElement {
  criteria: string;
  score: string;
}
