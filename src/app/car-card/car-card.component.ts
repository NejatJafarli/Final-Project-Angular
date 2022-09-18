import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Car } from '../cars/cars.component';

export interface img {
  id: number;
  carid: number;
  Value: string;
}

export interface fav {
  id: number;
  UserId: number;
  ElanId: number;
}
@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css'],
})
export class CarCardComponent implements OnInit {
  @Input() Car: any;
  constructor(private http: HttpClient) {}
  FavUser: any;
  ImgName: any;
  LoginedUserId:any
  

  IsFav: boolean = false;

  async control(){
    let res = await this.http
        .get(
          'http://localhost/apitest/getUserIdByName.php?name=' + this.FavUser
        )
        .toPromise();

      this.LoginedUserId = res;


      let re5s = await this.http
        .get<fav[]>('http://localhost/apitest/getUserFavories.php?id=' +  this.LoginedUserId)
        .toPromise();

      for (let i = 0; i < re5s!.length; i++) {
        let CarId = await this.http
          .get<any>(
            'http://localhost/apitest/getCarIdFromElanId.php?id=' +
              re5s![i].ElanId
          )
          .toPromise();
        if (CarId.CarId == this.Car.id) {
          this.IsFav = true;
          break;
        }
      }
  }
  async ngOnInit(): Promise<void> {
    if (sessionStorage.getItem('user')) {
      this.FavUser = sessionStorage.getItem('user');
      await this.control();
    }
    this.http
      .get<img[]>(
        'http://localhost/apitest/getCarImage.php?' + 'id=' + this.Car.id
      )
      .subscribe((img: img[]) => {
        this.ImgName = 'assets/cars/' + img[0].Value;
      });
  }

  async AddFavClick(){
    let res=await this.http
    .get(
      'http://localhost/apitest/addFav.php?UserId=' +
        this.LoginedUserId +
        '&CarId=' +
        this.Car.id
    ).toPromise();
    console.log(res);

    await this.control();


  }

  async RemoveFavClick(){
    let res=await this.http
    .get(
      'http://localhost/apitest/removeFav.php?UserId=' +
        this.LoginedUserId +
        '&CarId=' +
        this.Car.id
    ).toPromise();
    this.IsFav=false;
    console.log(res);

    await this.control();
    
  }
  
}
