import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js'; // データ型をimport
import { Color, Label } from 'ng2-charts'; // ng2-chartsのプロパティのデータ型をimport
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent implements OnInit {
  // data
  lineChartData: ChartDataSets[] = [
    {
      data: [100, 60, 90, 0, 80, 50, 60],
      label: 'ストレスレベル'
    },
  ];

  // ラベル
  lineChartLabels: Label[] = [
    '6日前',
    '5日前',
    '4日前',
    '3日前',
    '一昨日',
    '昨日',
    '今日'
  ];

  lineChartOptions = {
    // responsive: true,
  };

  // 色
  lineChartColors: Color[] = [
    {
      borderColor: '#F06292',
      backgroundColor: 'rgba(240,192,208,0.28)',
    },
  ];

  lineChartLegend = true; // グラフの属性ラベル
  lineChartPlugins = [];
  lineChartType = 'line'; // グラフの種類

  postObj: any = {};

  stressList: any[] = [];
  stressNum: any;

  constructor(
    public gs: GlobalService,
  ) { }

  ngOnInit() {
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
        // console.log(stressDataList);
        this.lineChartData[0]["data"] = stressDataList;
        localStorage.stress = stress;
      }
    );
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
