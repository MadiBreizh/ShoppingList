import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductService } from '../../providers/product-service/product-service';
import { Product } from '../../models/product.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
})

export class AddProductPage {
  formGroup : FormGroup;
  product : Product;
  name : string = '';
  quantity : number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private productService : ProductService) {
      this.formGroup = new FormGroup({
        name: new FormControl(),
        quantity: new FormControl
      })
  }

    saveProduct(product : Product){
      this.productService.saveProduct(product);
      this.navCtrl.pop();
    }

}
