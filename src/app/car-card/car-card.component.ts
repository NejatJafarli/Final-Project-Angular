import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Car } from '../cars/cars.component';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Extras } from '../car-details/car-details.component';
import { Router } from '@angular/router';

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

export interface temp {
  id: number;
  UserId: number;
}

export interface Contact {
  id: number;
  CarId: number;
  PhoneNumber: string;
}
export interface Elan {
  id: number;
  CarId: number;
  CityId: number;
  Status: number;
  UserId: number;
  SellerName: string;
}

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css'],
})
export class CarCardComponent implements OnInit {
  @Input() Car: any;
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private router: Router
  ) {}
  FavUser: any;
  ImgName: any;
  LoginedUserId: any;
  CarUserId: any;
  closeResult = '';

  selectedExtras: any;

  SelectedDes: string = '';
  SelectedPhoneNumber: string = '';

  SelectedCity: string = '';
  SelectedSellerName: string = '';
  SelectedCarType: string = '';
  SelectedFuel: string = '';
  SelectedGearBox: string = '';
  SelectedColor: string = '';
  SelectedMill: string = '';
  SelectedPower: string = '';
  SelectedSize: string = '';
  SelectedPrice: string = '';
  SelectedModel: string = '';
  SelectedMake: string = '';
  SelectedYear: string = '';
  SelectedPriceType: string = '';
  SelectedStatus: boolean = false;

  Fuel: string[] = [];
  Gearbox: string[] = [];
  Color: string[] = [];
  City: string[] = [];
  CarType: string[] = [];
  Make: string[] = [];
  EngineSize: string[] = [];

  IsFav: boolean = false;

  openXl(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async control() {
    let res = await this.http
      .get('http://localhost/apitest/getUserIdByName.php?name=' + this.FavUser)
      .toPromise();

    this.LoginedUserId = res;

    let re5s = await this.http
      .get<fav[]>(
        'http://localhost/apitest/getUserFavories.php?id=' + this.LoginedUserId
      )
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
  async EditCarClick() {
    if (this.SelectedMake == 'All') {
      alert('Please Select Car Make');
      return;
    }
    if (this.SelectedModel == '') {
      alert('Please Select Car Model');
      return;
    }
    if (this.SelectedYear == 'All') {
      alert('Please Select Car Year');
      return;
    }
    if (this.SelectedPrice == '') {
      alert('Please Enter Car Price');
      return;
    }
    if (this.SelectedSize == 'All') {
      alert('Please Enter Car EngineSize');
      return;
    }
    if (this.SelectedPower.length == 0) {
      alert('Please Enter Car EnginePower');
      return;
    }
    if (this.SelectedMill.length == 0) {
      alert('Please Select Car Millage');
      return;
    }
    if (this.SelectedColor == 'All') {
      alert('Please Select Car Color');
      return;
    }

    if (this.SelectedGearBox == 'All') {
      alert('Please Select Gear Box');
      return;
    }
    if (this.SelectedFuel == 'All') {
      alert('Please Select Fuel Type');
      return;
    }
    if (this.SelectedCarType == 'All') {
      alert('Please Select Car Type');
      return;
    }
    if (this.SelectedCity == 'All') {
      alert('Please Select City');
      return;
    }
    if (this.SelectedSellerName.length < 3) {
      alert('Please Enter Car Seller Name');
      return;
    }
    let reg = /^([0-9]{3}-)[0-9]{3}-[0-9]{2}-[0-9]{2}/;
    if (!reg.test(this.SelectedPhoneNumber)) {
      alert('Please Enter Valid Phone Number');
      return;
    }
    if (this.SelectedDes == '') {
      alert('Please Enter Car Description');
      return;
    }
    // const res = await this.http
    //   .get('http://localhost/apitest/getUserIdByName.php?name=' + this.haveUser)
    //   .toPromise();

    // this.UserId = res;

    const response = await this.http
      .get<Elan>(
        'http://localhost/apitest/getElanByCarId.php?id=' + this.Car.id
      )
      .toPromise();

    // this.UserId = res;
    let elanid = response!.id.toString();

    let Status: string = '0';

    if (this.SelectedStatus) Status = '1';
    console.log(Status);

    let formData = new FormData();
    formData.append('CarId', this.Car.id);
    formData.append('IsSalon', this.Car.IsSalon);
    formData.append('UserId', this.LoginedUserId);
    formData.append('elanid', elanid);
    formData.append('CarMake', this.SelectedMake);
    formData.append('CarModel', this.SelectedModel);
    formData.append('CarYear', this.SelectedYear);
    formData.append('CarColor', this.SelectedColor);
    formData.append('CarPrice', this.SelectedPrice);
    formData.append('CarPriceType', this.SelectedPriceType);
    formData.append('CarMillage', this.SelectedMill);
    formData.append('CarType', this.SelectedCarType);
    formData.append('GearBox', this.SelectedGearBox);
    formData.append('Status', Status);
    formData.append('CarCity', this.SelectedCity);
    formData.append('carEngineSize', this.SelectedSize);
    formData.append('Fuel', this.SelectedFuel);
    formData.append('carEnginePower', this.SelectedPower);
    formData.append('car_description', this.SelectedDes);
    formData.append('car_seller_name', this.SelectedSellerName);
    formData.append('car_seller_phone', this.SelectedPhoneNumber);
    formData.append('ExtraSelected', this.selectedExtras);

    const res = await this.http
      .post('http://localhost/apitest/EditCar.php', formData)
      .toPromise();

    if (res == 'Success') {
      this.modalService.dismissAll();
      this.redirectTo('/');
    }
  }
  async ngOnInit(): Promise<void> {
    const res = await this.http
      .get<Car[]>('http://localhost/apitest/getCars.php?query=All')
      .toPromise();

    this.Fuel = [...new Set(res?.map((item) => item.Fuel))];
    this.Gearbox = [...new Set(res?.map((item) => item.Gearbox))];
    this.Color = [...new Set(res?.map((item) => item.Color))];
    this.City = [...new Set(res?.map((item) => item.SellerCity))];
    this.CarType = [...new Set(res?.map((item) => item.CarType))];
    this.Make = [...new Set(res?.map((item) => item.Make))];

    this.SelectedCarType = this.Car.CarType;
    this.SelectedCity = this.Car.SellerCity;
    this.SelectedColor = this.Car.Color;
    this.SelectedDes = this.Car.Description;
    this.SelectedFuel = this.Car.Fuel;
    this.SelectedGearBox = this.Car.Gearbox;
    this.SelectedMill = this.Car.Milage;
    this.SelectedModel = this.Car.Model;
    this.SelectedMake = this.Car.Make;
    this.SelectedPower = this.Car.Power;
    this.SelectedPrice = this.Car.Price;
    this.SelectedPriceType = this.Car.PriceType;
    this.SelectedSellerName = this.Car.SellerName;
    this.SelectedYear = this.Car.Year;
    // this.SelectedPhoneNumber=this.Car.PhoneNumber;

    for (let i = 50; i < 16500; ) {
      this.EngineSize.push(i.toString());
      if (i <= 450) {
        i = i + 50;
      } else {
        if (i >= 500 && i < 7500) {
          i = i + 100;
        } else {
          if (i >= 7500) {
            i = i + 500;
          }
        }
      }
    }

    let arr: Number[] = [];

    for (let i = 0; i < this.EngineSize.length; i++)
      arr.push(Number(this.EngineSize[i].replace(',', '.').split(' ')[0]));
    arr = arr.sort((a, b) => Number(a) - Number(b));
    for (let i = 0; i < arr.length; i++) this.EngineSize[i] = arr[i].toString();

    let temp = String(this.Car.Engine);
    let temp2 = temp.split(' ')[0];
    //conver temp2 to double
    let temp3 = Number(temp2.replace(',', '.'));
    temp3 = temp3 * 1000;
    //round temp3
    temp3 = Math.round(temp3);
    this.SelectedSize = temp3.toString();
    this.SelectedPower = this.Car.EnginePower;

    let ress5 = await this.http
      .get<Extras[]>(
        'http://localhost/apitest/getCarExtras.php?' + 'id=' + this.Car.id
      )
      .toPromise();

    let Values: string[] = [];
    ress5!.forEach((element) => {
      Values.push(element.Value);
    });

    this.selectedExtras = Values;

    let responce = await this.http
      .get<Contact>(
        'http://localhost/apitest/getContactsByCarId.php?id=' + this.Car.id
      )
      .toPromise();

    let tempp5 = responce!.PhoneNumber;

    tempp5 = tempp5.replace('(', '').replace(')', '').replace(' ', '-');

    this.SelectedPhoneNumber = tempp5;

    let response = await this.http
      .get<Elan>(
        'http://localhost/apitest/getElanByCarId.php?id=' + this.Car.id
      )
      .toPromise();

    if (response!.Status == 1) this.SelectedStatus = true;

    // this.selectedExtras=this.Car.Extras.split(',');

    if (sessionStorage.getItem('user')) {
      this.FavUser = sessionStorage.getItem('user');
      await this.control();
    }

    let ress3 = await this.http
      .get<temp>(
        'http://localhost/apitest/getCarById.php?' + 'CarId=' + this.Car.id
      )
      .toPromise();

    //get CarUserId From Ress3
    this.CarUserId = ress3?.UserId;

    this.http
      .get<img[]>(
        'http://localhost/apitest/getCarImage.php?' + 'id=' + this.Car.id
      )
      .subscribe((img: img[]) => {
        this.ImgName = 'assets/cars/' + img[0].Value;
      });
  }
  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/about', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
  async AddFavClick() {
    let res = await this.http
      .get(
        'http://localhost/apitest/addFav.php?UserId=' +
          this.LoginedUserId +
          '&CarId=' +
          this.Car.id
      )
      .toPromise();
    console.log(res);

    await this.control();
  }

  async RemoveFavClick() {
    let res = await this.http
      .get(
        'http://localhost/apitest/removeFav.php?UserId=' +
          this.LoginedUserId +
          '&CarId=' +
          this.Car.id
      )
      .toPromise();
    this.IsFav = false;
    console.log(res);

    await this.control();
  }
}
