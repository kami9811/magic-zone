import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  // API用
  postObj: any = {};

  // 管理
  magicList: any[] = [];

  interval: any;

  name: any;
  id: any;
  
  constructor(
    private alertController: AlertController,
    private router: Router,
    public gs: GlobalService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.getList();
  }

  getList = () => {
    this.postObj["user_id"] = localStorage.user_id;
    this.postObj["hash"] = localStorage.hash;

    const body = this.postObj;
    console.log(body);
    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/getMagicList.php', body).subscribe(
      res => {
        console.log(res);
        this.magicList = res["magic_list"];
      }
    );
  }

  async presentModal(name: any, id: any) {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'from': 'list',
        'name': name,
        'id': id
      }
    });
    return await modal.present();
  }
}
