/** Angular Imports */
import { Component, OnInit } from "@angular/core";
import { ConfigService } from "./configuration.service";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl, Validators } from "@angular/forms";
import { element } from "protractor";

/**
 * Configuration component.
 */
@Component({
  selector: "mifosx-configuration",
  templateUrl: "./configuration.component.html",
  styleUrls: ["./configuration.component.scss"],
})
export class ConfigurationComponent implements OnInit {
  productData = [];

  checkweightage = false;

  categoryData = ["Individual", "Organisation", "Country", "CreditHistory", "Loan"];

  featureData = [];

  colour1Data = ["Green"];

  colour2Data = ["Amber"];

  colour3Data = ["Red"];

  minData = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  maxData = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  minGreen = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  maxGreen = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  minAmber = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  maxAmber = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  minRed = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  maxRed = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  public configurationObj = {
    feature: "",
    category: "",
    product: "",
    weightage: "",
    colour1: "Green",
    greenmin: 0,
    greenmax: 0,

    colour2: "Amber",
    ambermin: 0,
    ambermax: 0,

    colour3: "Red",
    redmin: 0,
    redmax: 0,
    id: "",

    greenminerror: "Error: This is req field or max < min",
    greenmaxerror: "Error: This is req field or max < min",
    amberminerror: "Error: This is req field or max < min",
    ambermaxerror: "Error: This is req field or max < min",
    redminerror: "Error: This is req field or max < min",
    redmaxerror: "Error: This is req field or max < min",
  };
  greenFormControl = new FormControl("", Validators.required);
  greenMaxFormControl = new FormControl("", Validators.required);

  amberFormControl = new FormControl("", Validators.required);
  amberMaxFormControl = new FormControl("", Validators.required);

  redFormControl = new FormControl("", Validators.required);
  redMaxFormControl = new FormControl("", Validators.required);
  errorMsg: string;

  constructor(private _configService: ConfigService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    let id = null;
    this.getFeatureCategory();
    this.readallproducts();
    this.route.params.subscribe((params) => {
      id = params["id"];
    });
    if (id) {
      this.minGreen = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      this.maxGreen = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      this.minAmber = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      this.maxAmber = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

      this.minRed = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      this.maxRed = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      this.getById(id);
      this.configurationObj.id = id;
    }
  }
  checkGreenMin() {
    this.greenFormControl.setErrors(null);
    this.greenMaxFormControl.setErrors(null);
    if (!this.configurationObj.greenmax) {
      this.greenFormControl.setErrors(null);
      return true;
    } else {
      let cond = true;
      if (this.configurationObj.greenmax < this.configurationObj.greenmin) {
        cond = false;
        this.greenFormControl.setErrors({
          notMatched: true,
        });
      } else {
        this.maxGreen = this.minGreen;
        this.greenFormControl.setErrors(null);
      }
      return cond;
    }
  }
  public readallproducts() {
    const successcallback = (data) => {
      for (let pro of data) {
        this.productData.push(pro.name);
      }
    };
    this._configService.readJSONfile(successcallback);
  }
  checkGreenMax() {
    this.greenFormControl.setErrors(null);
    this.greenMaxFormControl.setErrors(null);
    if (!this.configurationObj.greenmin) {
      this.greenMaxFormControl.setErrors(null);
      return true;
    } else {
      let cond = true;
      if (this.configurationObj.greenmax < this.configurationObj.greenmin) {
        console.log("in max");
        cond = false;
        this.greenMaxFormControl.setErrors({
          notMatched: true,
        });
      } else {
        this.greenMaxFormControl.setErrors(null);
      }
      return cond;
    }
  }
  public submitFeature() {
    console.log(Number(this.configurationObj.weightage));
    console.log(isNaN(Number(this.configurationObj.weightage)));
    this.checkweightage = false;
    this.errorMsg = "";
    if (
      Number(this.configurationObj.weightage) < 0 ||
      Number(this.configurationObj.weightage) > 1 ||
      isNaN(Number(this.configurationObj.weightage))
    ) {
      this.checkweightage = true;
    }
    if (
      this.configurationObj.ambermax &&
      this.configurationObj.ambermin &&
      this.configurationObj.redmax &&
      this.configurationObj.redmin &&
      this.configurationObj.greenmax &&
      this.configurationObj.greenmin &&
      this.configurationObj.category &&
      this.configurationObj.feature &&
      this.configurationObj.product
    ) {
    } else {
      this.errorMsg = "All Fields are mandatory";
    }

    const successcallback = (data) => {
      this.router.navigate(["criteria"]);
    };
    this._configService.saveConfig(this.configurationObj, successcallback);
  }
  public getFeatureCategory() {
    const successcallback = (data) => {
      // this.featureData = data;
      for (let feat of data) {
        let single = {
          id: JSON.parse(feat)["id"],
          feature: JSON.parse(feat)["feature"],
          category: JSON.parse(feat)["category"],
        };
        this.featureData.push(single);
      }
      // console.log(data);
      // console.log(JSON.stringify(data));
    };
    this._configService.getCategoryFeature(successcallback);
  }
  public async getById(id) {
    const successcallback = (data) => {
      console.log(JSON.stringify(data));

      this.configurationObj.ambermax = Number(data["ambermax"]);
      this.configurationObj.feature = data["feature"];
      this.configurationObj.product = data["product"];
      this.configurationObj.category = data["category"];
      this.configurationObj.weightage = data["weightage"];
      this.configurationObj.greenmax = Number(data["greenmax"]);
      this.configurationObj.greenmin = Number(data["greenmin"]);
      this.configurationObj.redmax = Number(data["redmax"]);
      this.configurationObj.redmin = Number(data["redmin"]);
      this.configurationObj.ambermin = Number(data["ambermin"]);
      // this.populateGreen();
    };
    await this._configService.getOneFeature(id, successcallback);
    //  this.populateGreen();
  }

  public onFeatureSelection() {
    let y = this.featureData.filter((feat) => feat.feature === this.configurationObj.feature);
    // this.featureData.forEach(x-> x.feature===this.configurationObj.feature)
    this.configurationObj.category = y[0].category;
  }
  async populateGreen() {
    console.log(JSON.stringify(this.configurationObj));
    // this.maxGreen = new Set([]);
    console.log("min" + this.configurationObj.greenmin);
    console.log("min" + this.configurationObj.greenmax);
    let i = this.configurationObj.greenmin;
    for (; i <= this.configurationObj.greenmax; i++) {
      this.maxGreen.add(i);
      console.log("inside for loop" + i);
    }
    console.log("Greenmax" + JSON.stringify(this.maxGreen));
    this.populateAmberMax();
    this.populateRedMax();
  }

  /**
  populateGreenMin() {
    if (this.minAmber.length === 0 && this.minRed.length === 0) {
      this.minGreen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    } else {

      let minAlreadyTaken = [];
      if (this.minAmber.length > 0) {
        for (let am of this.minAmber) {
          minAlreadyTaken.push(am);
        }
      }

      if (this.minRed.length > 0) {
        for (let am of this.minRed) {
          minAlreadyTaken.push(am);
        }
      }
      this.minGreen = this.minData.filter((item) => !minAlreadyTaken.includes(item));
    }
  }
*/
  // populateGreenMax() {

  //     let maxAlreadyTaken = new Set<Number>();
  //     if (this.maxAmber.size > 0) {
  //       for (let am of this.maxAmber.values) {
  //         maxAlreadyTaken.push(am);
  //       }
  //     }

  //     if (this.maxRed.size > 0) {
  //       for (let am of this.maxRed) {
  //         maxAlreadyTaken.push(am);
  //       }
  //     }
  //     this.maxGreen = this.maxData.filter((item) => !maxAlreadyTaken.includes(item));

  // }

  // populateAmberMin() {
  //   if (this.minGreen.length === 0 && this.minRed.length === 0) {
  //     this.minGreen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //   } else {

  //     let minAlreadyTaken = [];
  //     if (this.minGreen.length > 0) {
  //       for (let am of this.minGreen) {
  //         minAlreadyTaken.push(am);
  //       }
  //     }

  //     if (this.minRed.length > 0) {
  //       for (let am of this.minRed) {
  //         minAlreadyTaken.push(am);
  //       }
  //     }
  //     this.minAmber = this.minData.filter((item) => !minAlreadyTaken.includes(item));
  //   }
  // }

  populateAmberMax() {
    console.log("populating amber" + this.maxAmber);
    this.maxAmber = new Set([]);
    console.log(this.maxGreen.size > 0);
    console.log(this.configurationObj.greenmax);
    console.log(this.maxGreen.size > 0);
    if (this.maxGreen.size > 0 && this.configurationObj.greenmax) {
      let i = this.configurationObj.greenmax + 1;
      console.log("i" + i);
      console.log("bool" + (i <= 10));
      for (; i <= 10; i++) {
        console.log("i" + i);
        this.maxAmber.add(i);
      }
    }
    console.log(this.maxAmber);
    this.minAmber = this.maxAmber;
    if (!this.configurationObj.redmax && !this.configurationObj.redmin) {
      this.maxRed = this.minRed = this.minAmber;
    }
  }

  populateRedMax() {
    console.log("populating red" + this.maxRed);
    this.maxRed = new Set([]);
    if (this.maxAmber.size > 0 && this.configurationObj.ambermax && this.configurationObj.ambermin) {
      for (let i = this.configurationObj.ambermax + 1; i <= 10; i++) {
        this.maxRed.add(i);
      }
    }
    this.minRed = this.maxRed;
  }
  // populateRedMin() {
  //   if (this.minAmber.length === 0 && this.minGreen.length === 0) {
  //     this.minGreen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //   } else {
  //     /**
  //      * Else need to write the logic
  //      */
  //     let minAlreadyTaken = [];
  //     if (this.minAmber.length > 0) {
  //       for (let am of this.minAmber) {
  //         minAlreadyTaken.push(am);
  //       }
  //     }

  //     if (this.minGreen.length > 0) {
  //       for (let am of this.minGreen) {
  //         minAlreadyTaken.push(am);
  //       }
  //     }
  //     this.minRed = this.minData.filter((item) => !minAlreadyTaken.includes(item));
  //   }
  // }

  // populateRedMax() {
  //   if (this.maxAmber.length === 0 && this.maxGreen.length === 0) {
  //     this.maxGreen = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  //   } else {
  //     let maxAlreadyTaken = [];
  //     if (this.maxAmber.length > 0) {
  //       for (let am of this.maxAmber) {
  //         maxAlreadyTaken.push(am);
  //       }
  //     }

  //     if (this.maxGreen.length > 0) {
  //       for (let am of this.maxGreen) {
  //         maxAlreadyTaken.push(am);
  //       }
  //     }
  //     this.maxRed = this.maxData.filter((item) => !maxAlreadyTaken.includes(item));
  //   }
  // }

  // reCalculateMin(){
  //   this.populateGreenMin();
  //   this.populateAmberMin();
  //   this.populateRedMin();
  // }

  // reCalculateMax(){
  //   this.populateGreenMax();
  //   this.populateAmberMax();
  //   this.populateRedMax();
  // }
  onGreenMinSelection() {
    console.log("Min green" + this.configurationObj.greenmin);
  }
  onGreenMaxSelection() {
    this.maxGreen = new Set([]);
    for (let i = this.configurationObj.greenmin; i <= this.configurationObj.greenmax; i++) {
      this.maxGreen.add(i);
    }
    console.log(this.maxGreen);
    this.populateAmberMax();
  }
  onAmberMinSelection() {
    console.log("Min Amber" + this.configurationObj.ambermin);
  }
  onAmberMaxSelection() {
    console.log("Max Amber" + this.configurationObj.ambermax);
    this.populateRedMax();
  }
  onRedMinSelection() {
    console.log("Min green" + this.configurationObj.redmin);
  }
  onRedMaxSelection() {
    console.log("Max green" + this.configurationObj.redmax);
  }
}
