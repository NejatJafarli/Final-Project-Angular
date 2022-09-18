import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
export interface Car {
  id: number;
  userid: number;
  Color: string;
  CarType: string;
  Fuel: string;
  Gearbox: string;
  Make: string;
  Model: string;
  Year: Number;
  Engine: string;
  EnginePower: Number;
  Milage: Number;
  Price: Number;
  PriceType: string;
  IsSalon: Number;
  Description: string;
  SellerCity: string;
  SellerName: string;
}

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.css'],
})
@Injectable()
export class CarsComponent implements OnInit {
  cars: Car[] = [];
  Data: Car[] = [];
  Fuel: string[] = [];
  Gearbox: string[] = [];
  Color: string[] = [];
  City: string[] = [];
  CarType: string[] = [];
  Make: string[] = [];
  Model: string[] = [];
  EngineSize: string[] = [];
  Power: Number[] = [];

  SellerName: any = '';
  params: string = '';

  Username: any;
  FavUser: any;
  FavUserId: any;

  SelectedFuel: string = '';
  SelectedGearbox: string = '';
  SelectedColor: string = '';
  SelectedCity: string = '';
  SelectedCarType: string = '';
  SelectedMake: string = '';
  SelectedModel: string = '';
  SelectedEngineSize: string = '';
  SelectedPower: string = '';

  SelectedMinYear: string = '';
  SelectedMaxYear: string = '';
  SelectedMinPrice: string = '';
  SelectedMaxPrice: string = '';
  SelectedMinMileage: string = '';
  SelectedMaxMileage: string = '';

  states: any;

  constructor(private http: HttpClient, private router: Router) {
    this.states = this.router.getCurrentNavigation()?.extras.state;
    if (this.states) {
      this.SellerName = this.states['SellerName'];
      this.FavUser = this.states['Username'];
    }
  }

  async OnChange(event: any) {
    const res = await this.http
      .get<Car[]>(
        'http://localhost/apitest/getCars.php?query=' + event.target.value
      )
      .toPromise();

    //get all unique Fuel Data From Res without map function
    this.Fuel = [...new Set(res?.map((item) => item.Fuel))];
    this.Gearbox = [...new Set(res?.map((item) => item.Gearbox))];
    this.Color = [...new Set(res?.map((item) => item.Color))];
    this.City = [...new Set(res?.map((item) => item.SellerCity))];
    this.CarType = [...new Set(res?.map((item) => item.CarType))];
    // this.Make = [...new Set(res?.map((item) => item.Make))];
    this.Model = [...new Set(res?.map((item) => item.Model))];
    this.EngineSize = [...new Set(res?.map((item) => item.Engine))];
    this.Power = [...new Set(res?.map((item) => item.EnginePower))];

    //sort power

    this.Power = this.Power.sort((a, b) => Number(a) - Number(b));

    let arrs: Number[] = [];
    for (let i = 0; i < this.EngineSize.length; i++) {
      arrs.push(Number(this.EngineSize[i].replace(',', '.').split(' ')[0]));
    }

    //sort arr
    arrs = arrs.sort((a, b) => Number(a) - Number(b));
    for (let i = 0; i < arrs.length; i++)
      this.EngineSize[i] = arrs[i].toString().replace('.', ',') + ' L';

    //set select value to All
    this.SelectedFuel = 'All';
    this.SelectedGearbox = 'All';
    this.SelectedColor = 'All';
    this.SelectedCity = 'All';
    this.SelectedCarType = 'All';
    this.SelectedModel = 'All';
    this.SelectedEngineSize = 'All';
    this.SelectedPower = 'All';

    this.SelectedMinPrice = '';
    this.SelectedMaxPrice = '';

    this.SelectedMinMileage = '';
    this.SelectedMaxMileage = '';

    this.SelectedMinYear = 'All';
    this.SelectedMaxYear = 'All';
  }

  LoadMore(event: any) {
    //get cars[] last item id
    const lastId = this.cars[this.cars.length - 1].id;

    if (this.FavUserId) {
      this.params += '&FavUserId=' + this.FavUserId;
    }

    this.http
      .get<Car[]>(
        'http://localhost/apitest/getCarForQuery.php?limit=21&lastId=' +
          lastId +
          this.params
      )
      .subscribe((cars: Car[]) => {
        for (const car of cars) this.cars.push(car);
      });
  }

  OnClick(event: any) {
    this.SelectedFuel =
      this.SelectedFuel.trim() == '' ? 'All' : this.SelectedFuel;
    this.SelectedGearbox =
      this.SelectedGearbox.trim() == '' ? 'All' : this.SelectedGearbox;
    this.SelectedColor =
      this.SelectedColor.trim() == '' ? 'All' : this.SelectedColor;
    this.SelectedCity =
      this.SelectedCity.trim() == '' ? 'All' : this.SelectedCity;
    this.SelectedCarType =
      this.SelectedCarType.trim() == '' ? 'All' : this.SelectedCarType;
    this.SelectedMake =
      this.SelectedMake.trim() == '' ? 'All' : this.SelectedMake;
    this.SelectedModel =
      this.SelectedModel.trim() == '' ? 'All' : this.SelectedModel;
    this.SelectedEngineSize =
      this.SelectedEngineSize.trim() == '' ? 'All' : this.SelectedEngineSize;
    this.SelectedPower =
      this.SelectedPower.trim() == '' ? 'All' : this.SelectedPower;
    let onlyPower = this.SelectedPower.split(' ')[0];

    this.params = `?Fuel=${this.SelectedFuel}&Gearbox=${this.SelectedGearbox}&Color=${this.SelectedColor}&City=${this.SelectedCity}&CarType=${this.SelectedCarType}&Make=${this.SelectedMake}&Model=${this.SelectedModel}&EngineSize=${this.SelectedEngineSize}&Power=${onlyPower}`;

    this.params += `&MinMileage=${this.SelectedMinMileage}&MaxMileage=${this.SelectedMaxMileage}&MinYear=${this.SelectedMinYear}&MaxYear=${this.SelectedMaxYear}&MinPrice=${this.SelectedMinPrice}&MaxPrice=${this.SelectedMaxPrice}`;

    if (this.SellerName) this.params += `&SellerName=${this.SellerName}`;
    this.http
      .get<Car[]>('http://localhost/apitest/getCarForQuery.php' + this.params)
      .subscribe((cars: Car[]) => {
        this.cars = cars;
      });
  }
  async ngOnInit(): Promise<void> {
    if (this.FavUser) {
      const res = await this.http
        .get(
          'http://localhost/apitest/getUserIdByName.php?name=' + this.FavUser
        )
        .toPromise();

      console.log(res);
      this.FavUserId = res;
      this.params += `&FavUserId=${res}`;
    }

    //get states from route

    if (this.SellerName) this.params += `&SellerName=${this.SellerName}`;

    console.log(this.params);

    this.http
      .get<Car[]>(
        'http://localhost/apitest/getCarForQuery.php?limit=51' + this.params
      )
      .subscribe((cars: Car[]) => {
        this.cars = cars;
      });

    const res = await this.http
      .get<Car[]>('http://localhost/apitest/getCars.php?query=All')
      .toPromise();

    this.Fuel = [...new Set(res?.map((item) => item.Fuel))];
    this.Gearbox = [...new Set(res?.map((item) => item.Gearbox))];
    this.Color = [...new Set(res?.map((item) => item.Color))];
    this.City = [...new Set(res?.map((item) => item.SellerCity))];
    this.CarType = [...new Set(res?.map((item) => item.CarType))];
    this.Make = [...new Set(res?.map((item) => item.Make))];
    this.Model = [...new Set(res?.map((item) => item.Model))];
    this.EngineSize = [...new Set(res?.map((item) => item.Engine))];
    this.Power = [...new Set(res?.map((item) => item.EnginePower))];

    this.Power = this.Power.sort((a, b) => Number(a) - Number(b));

    let arr: Number[] = [];
    for (let i = 0; i < this.EngineSize.length; i++) {
      arr.push(Number(this.EngineSize[i].replace(',', '.').split(' ')[0]));
    }

    //sort arr
    arr = arr.sort((a, b) => Number(a) - Number(b));
    for (let i = 0; i < arr.length; i++) {
      this.EngineSize[i] = arr[i].toString().replace('.', ',') + ' L';
    }

    this.SelectedMinYear = 'All';
    this.SelectedMaxYear = 'All';
  }
}
