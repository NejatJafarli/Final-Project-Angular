import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Car } from '../cars/cars.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  closeResult = '';

  RegisterPass: string = '';
  RegisterUserName: string = '';
  RegisterEmail: string = '';

  LoginUserName: string = '';
  LoginPass: string = '';
  filedata: any;
  filedata2: any;

  UserId: any;

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

  haveUser: string = '';

  Fuel: string[] = [];
  Gearbox: string[] = [];
  Color: string[] = [];
  City: string[] = [];
  CarType: string[] = [];
  Make: string[] = [];
  EngineSize: string[] = [];

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private router: Router
  ) {
    let temp = sessionStorage.getItem('user');
    this.haveUser = temp ? temp : '';
  }

  async FavClick() {
    this.router.navigateByUrl('/about', { skipLocationChange: true }).then(() =>
      this.router.navigateByUrl('/', {
        state: { id: 1, Username: this.haveUser },
      })
    );
  }

  FileEventTwo(e: any) {
    this.filedata2 = e.target.files;
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

    this.SelectedCarType = 'All';
    this.SelectedColor = 'All';
    this.SelectedGearBox = 'All';
    this.SelectedFuel = 'All';
    this.SelectedSize = 'All';
    this.SelectedYear = 'All';
    this.SelectedMake = 'All';
    this.SelectedPriceType = 'AZN';
    this.SelectedCity = 'All';

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
  }

  async RegisterOnClick() {
    console.log(this.haveUser);

    let myFormData = new FormData();

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    myFormData.append('image', this.filedata);
    myFormData.append('email', this.RegisterEmail);
    myFormData.append('username', this.RegisterUserName);
    myFormData.append('password', this.RegisterPass);
    myFormData.append('action', 'signup');

    //send post request
    const res = await this.http
      .post('http://localhost/apitest/LoginAndSingup.php', myFormData, {
        headers: headers,
      })
      .toPromise();

    console.log(res);

    // this.modalService.dismissAll();
  }
  Logout() {
    sessionStorage.removeItem('user');
    this.haveUser = '';
    alert('Logout Successfull');
  }
  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/about', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  async AddCarClick() {
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
    if (!this.filedata2) {
      alert('Please Select Images');
    }
    if (this.filedata2.length < 3) {
      alert('Please Select Atleast 3 Images');
      return;
    }
    if (this.filedata2.length > 21) {
      alert('Please Select Atmost 20 Images');
      return;
    }
    const res = await this.http
      .get('http://localhost/apitest/getUserIdByName.php?name=' + this.haveUser)
      .toPromise();

    this.UserId = res;

    let formData = new FormData();
    formData.append('UserId', this.UserId);
    formData.append('CarMake', this.SelectedMake);
    formData.append('CarModel', this.SelectedModel);
    formData.append('CarYear', this.SelectedYear);
    formData.append('CarColor', this.SelectedColor);
    formData.append('CarPrice', this.SelectedPrice);
    formData.append('CarPriceType', this.SelectedPriceType);
    formData.append('CarMillage', this.SelectedMill);
    formData.append('CarType', this.SelectedCarType);
    formData.append('GearBox', this.SelectedGearBox);
    formData.append('CarCity', this.SelectedCity);
    formData.append('carEngineSize', this.SelectedSize);
    formData.append('Fuel', this.SelectedFuel);
    formData.append('carEnginePower', this.SelectedPower);
    formData.append('car_description', this.SelectedDes);
    for (var i = 0; i < this.filedata2.length; i++)
      formData.append('car_image[]', this.filedata2[i]);
    formData.append('car_seller_name', this.SelectedSellerName);
    formData.append('car_seller_phone', this.SelectedPhoneNumber);
    formData.append('ExtraSelected', this.selectedExtras);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    const ress = await this.http
      .post('http://localhost/apitest/AddNewCar.php', formData, {
        headers: headers,
      })
      .toPromise();
      
    if (ress == 'success') {
      alert('Car Added Successfully');
      this.modalService.dismissAll();
    }
    else alert('Error Occured');
  }
  async LoginOnClick() {
    let myFormData = new FormData();

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    myFormData.append('email', this.LoginUserName);
    myFormData.append('password', this.LoginPass);
    myFormData.append('action', 'login');

    //send post request
    const res = await this.http
      .post('http://localhost/apitest/LoginAndSingup.php', myFormData, {
        headers: headers,
      })
      .toPromise();

    if (res == 'Login Successfull') {
      sessionStorage.setItem('user', this.LoginUserName);
      this.haveUser = sessionStorage.getItem('user')!;
      this.LoginUserName = '';
      this.LoginPass = '';
      this.modalService.dismissAll();

      this.redirectTo('/');
    } else {
      alert('Login Failed');
      this.LoginPass = '';
    }
  }

  fileEvent(e: any) {
    this.filedata = e.target.files[0];
  }
  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
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
}
