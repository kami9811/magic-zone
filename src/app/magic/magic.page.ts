import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../global.service';

import { ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';

@Component({
  selector: 'app-magic',
  templateUrl: './magic.page.html',
  styleUrls: ['./magic.page.scss'],
})
export class MagicPage implements OnInit {
  lowFill: string = 'outline';
  middleFill: string = 'outline';
  highFill: string = 'outline';

  middleDisabled: Boolean = true;
  highDisabled: Boolean = true;

  outputLevel: Number;

  name: string = '';

  postObj: any = {};

  constructor(
    public gs: GlobalService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    if(Number(localStorage.level) >= 1) {
      this.middleDisabled = false;
    }
    if(Number(localStorage.level) >= 2) {
      this.highDisabled = false;
    }
  }

  onGrid = (e: any) => {
    if(e.target.id === "low") {
      // console.log(e.target.id);
      this.lowFill = 'solid';
      this.middleFill = 'outline';
      this.highFill = 'outline';
      this.outputLevel = 0;
    }else if(e.target.id === "middle") {
      // console.log(e.target.id);
      this.lowFill = 'outline';
      this.middleFill = 'solid';
      this.highFill = 'outline';
      this.outputLevel = 1;
    }else if(e.target.id === "high") {
      // console.log(e.target.id);
      this.lowFill = 'outline';
      this.middleFill = 'outline';
      this.highFill = 'solid';
      this.outputLevel = 2;
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {
        'from': 'use',
        'name': this.name,
        'id': localStorage.user_id,
        'level': this.outputLevel
      }
    });
    return await modal.present();
  }
}
