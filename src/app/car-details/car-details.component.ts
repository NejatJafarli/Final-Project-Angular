import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../cars/cars.component';

import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { img } from '../car-card/car-card.component';

export interface Extras {
  id: number;
  CarId: number;
  Value: string;
}

export interface Contacts {
  id: number;
  CarId: number;
  PhoneNumber: string;
}
@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
})
export class CarDetailsComponent implements OnInit {
  id: any;
  Car: any;
  ImgNames: string[] = [];
  Extras: string[] = [];
  Contacts: string[] = [];
  FirstImg: string = '';

  IsSalon: any = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private config: NgbAccordionConfig,
    private router: Router
  ) {
    config.closeOthers = true;
    config.type = 'info';
  }
  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    //get car by id
    let res = await this.http
      .get<Car>('http://localhost/apitest/GetCarById.php?id=' + this.id)
      .toPromise();
    this.Car = res;
    this.http
      .get<img[]>(
        'http://localhost/apitest/getCarImage.php?' + 'id=' + this.Car.id
      )
      .subscribe((img: img[]) => {
        for (let i = 0; i < img.length; i++)
          this.ImgNames.push('assets/cars/' + img[i].Value);
        this.FirstImg = this.ImgNames[0];
      });
    this.http
      .get<Extras[]>(
        'http://localhost/apitest/getCarExtras.php?' + 'id=' + this.Car.id
      )
      .subscribe((img: Extras[]) => {
        for (let i = 0; i < img.length; i++) this.Extras.push(img[i].Value);
      });
    this.http
      .get<Contacts[]>(
        'http://localhost/apitest/getCarContacts.php?' + 'id=' + this.Car.id
      )
      .subscribe((img: Contacts[]) => {
        for (let i = 0; i < img.length; i++)
          this.Contacts.push(img[i].PhoneNumber);
      });
    if (String(this.Car.SellerName).toLowerCase().startsWith('avtosalon'))
      this.IsSalon = true;
  }

  SellerNameClick() {
    this.router.navigateByUrl('/', {
      state: { id: 1, SellerName: this.Car.SellerName },
    });
  }
  OnClickImg(event: any) {
    this.FirstImg = event.target.src;
    //remove class from all other images
    let imgs = document.getElementsByClassName('active');
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].classList.remove('active');
    }
    //add new class to event.target
    event.target.classList.add('active');
  }
}
