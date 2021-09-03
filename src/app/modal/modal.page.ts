import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  // Data passed in by componentProps
  @Input() from: any;
  @Input() name: string;
  @Input() id: Number;
  @Input() level: Number;

  @ViewChild('myCanvas') myCanvas;

  historyFlag: Boolean = false;
  useFlag: Boolean = false;
  listFlag: Boolean = false;
  outputFlag: Boolean = false;
  closeFlag: Boolean = false;

  postObj: any = {};

  result: String;
  power: Number = 0;
  require: Number;
  magnification: Number;
  areaNum: any;
  areaList: any[] = []

  status: string = '召喚中…';

  sound: Number;

  interval: any;

  constructor(
    public modalController: ModalController,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    if(this.from === "history") {
      this.historyFlag = true;
      this.postObj["user_id"] = localStorage.user_id;
      this.postObj["magic_id"] = this.id;
      this.postObj["hash"] = localStorage.hash;
      const body = this.postObj;
      console.log(body)

      this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getMagicHistoryDetail.php', body).subscribe(
        res => {
          console.log(res);
          this.areaList = res["area_list"];
          this.areaNum = res["area_num"];
          // 描画処理
          const canvas = this.myCanvas.nativeElement;
          const ctx = canvas.getContext('2d');
          const base = 60;

          ctx.beginPath();
          let first_y = Math.floor(this.areaList[0]["area"] / 5) * base + 30;
          let first_x = (this.areaList[0]["area"] % 5) * base + 30;
          console.log(first_x, first_y);
          ctx.moveTo(first_x, first_y);
          for(let step = 1; step < this.areaNum; step++){
            let y = Math.floor(this.areaList[step]["area"] / 5) * base + 30;
            let x = (this.areaList[step]["area"] % 5) * base + 30;
            console.log(x, y);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(first_x, first_y);
          ctx.strokeStyle = "#2A3990";
          ctx.lineWidth = 10;
          ctx.stroke();

          // resultとpowerに代入
          if(res["result"] == 1) {
            this.result = "Success!";
            this.power = res["power"];
          }else if(res["result"] == 2) {
            this.result = "Failed...";
            this.power = 0;
          }
        }
      );
    }else if(this.from === "use") {
      this.useFlag = true;
      this.postObj["user_id"] = localStorage.user_id;
      this.postObj["magic_count"] = localStorage.magic_count;
      this.postObj["magic_name"] = this.name;
      this.postObj["magic_rank"] = this.level;
      this.postObj["element"] = localStorage.element;
      this.postObj["hash"] = localStorage.hash;
      const body = this.postObj;
      console.log(body)

      this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/registerMagicLog.php', body).subscribe(
        res => {
          console.log(res);
          // 描画処理
          const canvas = this.myCanvas.nativeElement;
          const ctx = canvas.getContext('2d');
          const base = 60;

          this.interval = setInterval(() => {
            // Function
            this.getStatus();
          }, 1500);
        }
      );
    }else if(this.from === "list") {
      this.listFlag = true;
      this.postObj["user_id"] = localStorage.user_id;
      this.postObj["id"] = this.id;
      this.postObj["hash"] = localStorage.hash;
      const body = this.postObj;
      console.log(body)

      this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getMagicDetail.php', body).subscribe(
        res => {
          console.log(res);
          this.areaList = res["area_list"];
          this.areaNum = res["area_num"];
          // 描画処理
          const canvas = this.myCanvas.nativeElement;
          const ctx = canvas.getContext('2d');
          const base = 60;

          ctx.beginPath();
          let first_y = Math.floor(this.areaList[0]["area"] / 5) * base + 30;
          let first_x = (this.areaList[0]["area"] % 5) * base + 30;
          console.log(first_x, first_y);
          ctx.moveTo(first_x, first_y);
          for(let step = 1; step < this.areaNum; step++){
            let y = Math.floor(this.areaList[step]["area"] / 5) * base + 30;
            let x = (this.areaList[step]["area"] % 5) * base + 30;
            console.log(x, y);
            ctx.lineTo(x, y);
          }
          ctx.lineTo(first_x, first_y);
          ctx.strokeStyle = "#2A3990";
          ctx.lineWidth = 10;
          ctx.stroke();

          // requireとmagnification
          this.require = res["require"];
          this.magnification = res["magnification"];
        }
      );
    }
  }

  getStatus = () => {
    this.postObj["user_id"] = localStorage.user_id;
    this.postObj["magic_count"] = localStorage.magic_count;
    this.postObj["hash"] = localStorage.hash;
    const body = this.postObj;

    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getMagicStatus.php', body).subscribe(
      res => {
        console.log(res);
        if(res["result"] == 2) {
          this.closeFlag = true;
          this.status = '失敗...';
        }else if(res["result"] == 1) {
          this.postObj["user_id"] = localStorage.user_id;
          this.postObj["magic_count"] = localStorage.magic_count;
          this.postObj["hash"] = localStorage.hash;
          const body = this.postObj;
      
          this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getMagicShape.php', body).subscribe(
            resp => {
              console.log(resp);
              this.areaList = resp["area_list"];
              this.areaNum = resp["area_num"];

              // 描画処理
              const canvas = this.myCanvas.nativeElement;
              const ctx = canvas.getContext('2d');
              const base = 60;

              ctx.beginPath();
              let first_y = Math.floor(this.areaList[0]["area"] / 5) * base + 30;
              let first_x = (this.areaList[0]["area"] % 5) * base + 30;
              console.log(first_x, first_y);
              ctx.moveTo(first_x, first_y);
              for(let step = 1; step < this.areaNum; step++){
                let y = Math.floor(this.areaList[step]["area"] / 5) * base + 30;
                let x = (this.areaList[step]["area"] % 5) * base + 30;
                console.log(x, y);
                ctx.lineTo(x, y);
              }
              ctx.lineTo(first_x, first_y);
              ctx.strokeStyle = "#2A3990";
              ctx.lineWidth = 10;
              ctx.stroke();

              this.outputFlag = true;
              this.status = '声より放て！';
              clearInterval(this.interval);
            }
          );
        }
      }
    );
  }

  output = () => {
    this.postObj["user_id"] = localStorage.user_id;
    this.power = this.areaNum * 10;
    this.postObj["power"] = this.power;
    this.postObj["hash"] = localStorage.hash;
    const body = this.postObj;

    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/registerMagicResult.php', body).subscribe(
      res => {
        console.log(res);
        localStorage.magic_count = res["magic_count"];
        this.status = "発動！";
        this.outputFlag = false;
        this.closeFlag = true;
      }
    );
  }

  dismiss = () => {
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
