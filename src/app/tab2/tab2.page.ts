import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{
    // API用
    postObj: any = {};
  
    // 履歴管理
    historyList: any[] = [];
  
    interval: any;

    name: any;
    id: any;

  constructor(
    private alertController: AlertController,
    private router: Router,
    public gs: GlobalService,
    public modalController: ModalController,
  ) {}

  ngOnInit(){
    this.interval = setInterval(() => {
      // Function
      this.getList();
    }, 1500);
  }

  getList = () => {
    this.postObj["user_id"] = localStorage.user_id;
    this.postObj["hash"] = localStorage.hash;

    const body = this.postObj;
    console.log(body);
    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getMagicHistoryList.php', body).subscribe(
      res => {
        console.log(res);
        this.historyList = res["history_list"];
      }
    );
  }

  async presentModal(name: any, id: any) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'from': 'history',
        'name': name,
        'id': id
      }
    });
    return await modal.present();
  }

}
