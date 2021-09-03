import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';
import { LineChartComponent } from '../line-chart/line-chart.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  // API用
  postObj: any = {};
  returnObj: any = {};
  articleObj: any = {};
  objWord: any;

  // 記事
  articleList: any[] = [];

  interval: any;

  lineChart: any = LineChartComponent;

  stress: any;

  level: String = "";
  stressNum: any;
  stressList: any[] = [];

  constructor(
    private alertController: AlertController,
    private router: Router,
    public gs: GlobalService,
  ) {}

  // 自動ログイン管理, 記事取得
  ngOnInit(){
    const now = new Date();
    let six = new Date();
    six.setDate(six.getDate() - 6);
    let firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    // console.log(firstDayPrevMonth);
    var rtn_str = this.getStringFromDate(firstDayPrevMonth);
    // console.log(rtn_str);

    this.postObj["user_id"] = localStorage.user_id;
    this.postObj["range"] = rtn_str;
    this.postObj["hash"] = localStorage.hash;
    const body = this.postObj;

    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getDashboard.php', body).subscribe(
      res => {
        console.log(res);
        this.stressList = res["stress_list"];
        this.stressNum = res["stress_num"];
        localStorage.level = res["user_level"];

        const nowBase = this.getStringFromDate(now);
        const sixBase = this.getStringFromDate(six);

        let pointer = 0;
        let stressUp = 1;
        let stress = 0;
        let stressDataList = [];

        for(let step=firstDayPrevMonth; Number(this.getStringFromDate(step)) <= Number(nowBase); step.setDate(step.getDate() + 1)){
          // console.log(this.getStringFromDate(step));
          // console.log(pointer);
          if(this.stressList[pointer]["date"] === this.getStringFromDate(step)) {
            stress = this.stressList[pointer]["stress_value"];
            stressUp = 1;
            pointer = pointer + 1;
            if(pointer == this.stressNum){
              pointer = pointer - 1;
            }
          }else {
            stress = stress + (10 * stressUp);
            if(stress > 100) {
              stress = 100;
            }
            stressUp = stressUp + 1;
          }
          
          // DataListへの追加の処理
          if(Number(this.getStringFromDate(step)) >= Number(sixBase)) {
            // console.log(step);
            // console.log(stressDataList);
            stressDataList.push(stress);
          }
        }
        localStorage.stress = stress / 100;
        this.stress = localStorage.stress;
        if(localStorage.level == 0) {
          this.level = "駆け出しの厨二病";
        }else if(localStorage.level == 1) {
          this.level = "魔術師";
        }else if(localStorage.level == 2) {
          this.level = "第一級陸上無線技術士";
        }
      }
    );
  }

  navigateToList = () => {
    this.router.navigate(['/list']);
  }
  navigateToMagic = () => {
    this.router.navigate(['/magic']);
  }

  getStringFromDate = (date: any) => {
 
    var year_str = date.getFullYear();
    //月だけ+1すること
    var month_str = 1 + date.getMonth();
    if(Number(month_str) < 10) {
      month_str = "0" + month_str;
    }
    var day_str = date.getDate();
    if(Number(day_str) < 10) {
      day_str = "0" + day_str;
    }
    
    var format_str = 'YYYYMMDD';
    format_str = format_str.replace(/YYYY/g, year_str);
    format_str = format_str.replace(/MM/g, month_str);
    format_str = format_str.replace(/DD/g, day_str);
    
    return format_str;
   };
}
