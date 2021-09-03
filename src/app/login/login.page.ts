import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  id: string = '';
  password: string = '';

  status: Number = 0;
  // status: Number = 200;  // デバッグ用

  postObj: any = {};

  constructor(
    private router: Router,
    public gs: GlobalService,
  ) { }

  ngOnInit() {
    this.postObj['user_id'] = localStorage.user_id;
    this.postObj['password'] = localStorage.password;

    this.login();
  }
  navigate = () => {
    this.postObj['user_id'] = this.id;
    this.postObj['password'] = this.password;

    this.login();
  }
  navigateToSignup = () => {
    this.router.navigate(['/signup']);
  }

  login = () => {
    const body = this.postObj;

    this.gs.http('https://kn46itblog.com/hackathon/2021_0/php_apis/login.php', body).subscribe(
      res => {
        console.log(res);
        this.status = res["status"];
        // console.log(this.returnObj["status"]);
        if(this.status == 200){
          localStorage.user_id = this.postObj["user_id"];
          localStorage.magic_count = res["magic_count"];
          localStorage.element = res["element"];
          localStorage.hash = res["hash"];
          localStorage.password = this.password;
          console.log('Stored item!');
          this.router.navigate(['/tabs', 'tab1']);
        }
      }
    );
  }
}
