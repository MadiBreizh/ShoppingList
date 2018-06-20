import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProductService } from '../../providers/product-service/product-service';
import { Product } from '../../models/product.model';
import { FormGroup, FormControl } from '@angular/forms';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';


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

  barrecodeValue = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private productService : ProductService,
    private barcodeScanner: BarcodeScanner) {
      //TODO : Edit from control
      this.formGroup = new FormGroup({
        name: new FormControl(),
        quantity: new FormControl
      })
  }

    saveProduct(product : Product){
      this.productService.saveProduct(product);
      this.navCtrl.pop();
    }

    onScan(){
      this.barcodeScanner.scan().then(barcodeData => {
          this.barrecodeValue = barcodeData.text;  
      }).catch(err => {
        console.log('Error', err);
       });
    }

}
