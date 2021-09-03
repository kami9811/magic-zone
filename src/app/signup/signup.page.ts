import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  id: string;
  element: Number;
  device_id: string;
  password: string;

  postObj: any = {};

  constructor(
    private alertController: AlertController,
    private router: Router,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
  }

  async alertSuccess() {
    const alert = await this.alertController.create({
      header: '新規登録',
      message: '新規登録に成功しました.',
      buttons: ['OK']
    })

    await alert.present();
  }
  async alertFailer() {
    const alert = await this.alertController.create({
      header: '新規登録',
      message: '新規登録に失敗しました.<br>IDが重複しています.',
      buttons: ['OK']
    })

    await alert.present();
  }

  signup = () => {
    this.postObj['user_id'] = this.id;
    this.postObj['element'] = this.element;
    this.postObj['device_id'] = this.device_id;
    this.postObj['password'] = this.password;
    const body = this.postObj;

    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/signup.php', body).subscribe(
      res => {
        if(res['status'] == 200){
          this.alertSuccess();
          this.router.navigate(['/login']);
        }
        else{
          this.alertFailer(); 
        }
      }
    )
  }

}
