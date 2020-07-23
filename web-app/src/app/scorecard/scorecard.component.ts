/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { ScoreCardService } from "./scorecard.service";
import { Router, ActivatedRoute } from "@angular/router";

/**
 * Create Scorecard Component
 */
@Component({
  selector: "mifosx-scorecard",
  templateUrl: "./scorecard.component.html",
  styleUrls: ["./scorecard.component.scss"],
})
export class ScorecardComponent implements OnInit {
  model = ["Criteria", "Statistical", "Machine Learning"];

  displayedColumns: string[] = ["Category", "Feature", "Score", "Color"];
  public dataSource = [];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  totalScore = 0;
  modelType: string[] = [];
  pred = "N/A";
  acc = "N/A";
  stat_pred = "N/A";
  stat_acc = "N/A";
  isRegSelected = false;
  stat_var_pred = "N/A";
  stat_var_risk = "N/A";
  isVarSelected = false;
  stat_wl_good = "N/A";
  stat_wl_bad = "N/A";
  stat_pred_wl_good = "N/A";
  stat_pred_wl_bad = "N/A";
  isMVSelected = false;
  criteria = false;
  ml = false;
  statistical = false;

  public scorecardObj = {
    age: [],
    ageweitage: 0,
    gender: [],
    genderweightage: 0,
  };
  errorFlag = false;
  colorgreen = false;
  scoregreen = '';
  coloramber = false;
  scoreamber = '';
  colorred = false;
  scorered = '';
  // dataTable: [];
  loanId = "";
  loanValues = [];

  constructor(private _scoreCardService: ScoreCardService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.getLoans();
  }

  public getLoans() {
    const successcallback = (data) => {
      for (let loan of data["pageItems"]) {
        let det = {
          id: loan["id"],
          clientId: loan["clientId"],
        };
        this.loanValues.push(det);
      }
      //  console.log(JSON.stringify(data['pageItems'][0]));
    };
    this._scoreCardService.getLoan(successcallback);
  }

  public getStatisticalScoring(){
    const statsuccesscallback = (data) => {
      console.log(data);
      if(data['scorecard']['method'] == "LinReg" || data['scorecard']['method'] == "PolyReg"){
        this.isRegSelected = true;
        this.isVarSelected = false;
        this.isMVSelected = false;
        this.stat_acc = data['scorecard']['prediction'];
        this.stat_pred = data['scorecard']['color'];
      }

      if(data['scorecard']['method'] == "VaR"){
        this.isRegSelected = false;
        this.isVarSelected = true;
        this.isMVSelected = false;
        this.stat_var_risk = data['scorecard']['Risk'];
        this.stat_var_pred = data['scorecard']['color'];
      }

      if(data['scorecard']['method'] == "MANOVA"){
        this.isRegSelected = false;
        this.isVarSelected = false;
        this.isMVSelected = true;
        this.stat_wl_good = data['scorecard']['WL_good'];
        this.stat_wl_bad = data['scorecard']['WL_bad'];
        this.stat_pred_wl_good = data['scorecard']['WL_test_good'];
        this.stat_pred_wl_bad = data['scorecard']['WL_test_bad'];
      }
    }
    this._scoreCardService.getStatScore(statsuccesscallback, this.loanId)
  }

  public getMLScoring(){
    const mlsuccesscallback = (data) => {
      console.log(data);
      console.log(data['scorecard']["result"]);
      console.log(data['scorecard']["accuracy"])
      this.pred = data['scorecard']["result"];
      this.acc = data['scorecard']["accuracy"];
    }
    this._scoreCardService.getMLScore(mlsuccesscallback, this.loanId)
  }

  public getClientDetails() {
    console.log(this.ml);
    console.log(this.statistical);
    console.log(this.criteria);
    if(this.statistical){
      this.getStatisticalScoring();
    }
    if(this.ml){
      this.getMLScoring();
    }
    if(this.criteria){
      this.errorFlag = false;
      this.colorgreen = false;
      this.coloramber = false;
      this.colorred = false;
      this.colorgreen = true;
      if (!this.loanId) {
        this.errorFlag = true;
      } else {
        let clientId = null;

        for (let loan of this.loanValues) {
          if (loan.id === +this.loanId) {
            clientId = loan.clientId;
            break;
          }
        }
        if (clientId) {
          const successcallback = (data) => {
            let dob = data["dateOfBirth"];
            let gender = data["gender"];

            console.log(dob);
            console.log(gender);
            let age = 0;
            let gen = "";
            if (dob) {
              age = new Date().getFullYear() - dob[0];
            }
            if (gender) {
              gen = gender["name"].toUpperCase();
            }
            console.log("GENDER", gen)
            const successcallbackGen = (datagen) => {
              let res = [];
              console.log(datagen["genderScore"])
              this.totalScore = Number(datagen["ageScore"]) + Number(datagen["genderScore"]);
              res.push({
                Category: "Individual",
                Feature: " Age",
                Score: datagen["ageScore"],
                Color: datagen["ageColor"]
              });
              res.push({
                Category: "Individual",
                Feature: " Gender",
                Score: datagen["genderScore"],
                Color: datagen["genderColor"]
              });

              let xmlsuccesscallback = (valueData) => {
                //data = JSON.parse(valueData)
                console.log(valueData['scorecard']['color'][0]);
                var count = 0;
                for(var i = 0; i < valueData['scorecard']['color'].length ; i++){
                  count = count + Number(valueData['scorecard']['score'][i])
                  res.push({
                  Category: valueData['scorecard']['category'][i],
                  Feature: valueData['scorecard']['feature'][i],
                  Score: valueData['scorecard']['score'][i],
                  Color: valueData['scorecard']['color'][i]
                  });
                }

                //this.dataSource = res;
                this.totalScore = this.totalScore + count;
                //console.log("json string", JSON.stringify(valueData), valueData);
              }
              
              let jsonsuccesscallback = (valueData) => {
                //data = JSON.parse(valueData)
                console.log(valueData['scorecard']['color'][0]);
                var count = 0;
                for(var i = 0; i < valueData['scorecard']['color'].length ; i++){
                  count = count + Number(valueData['scorecard']['score'][i])
                  res.push({
                  Category: valueData['scorecard']['category'][i],
                  Feature: valueData['scorecard']['feature'][i],
                  Score: valueData['scorecard']['score'][i],
                  Color: valueData['scorecard']['color'][i]
                  });
                }

                this.dataSource = res;
                this.totalScore = this.totalScore + count;
                //console.log("json string", JSON.stringify(valueData), valueData);
              }
              this._scoreCardService.getXmlScore(xmlsuccesscallback, this.loanId);
              this._scoreCardService.getJsonScore(jsonsuccesscallback, this.loanId);
            };

            this._scoreCardService.getAllScore(successcallbackGen, age, gen);
          };
          this._scoreCardService.getClientDetails(successcallback, clientId);
        }
      }
    }
  }
}

export interface PeriodicElement {
  Category: string;
  Feature: string;
  Score: string;
  Color: string;
}
