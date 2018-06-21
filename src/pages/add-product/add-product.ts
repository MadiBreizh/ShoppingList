import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

//Provider
import { ProductService } from '../../providers/product-service/product-service';
import { OfFactProvider } from '../../providers/of-fact/of-fact';

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
    private offactService : OfFactProvider,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController) {
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
        this.offactService.getProductByBarre(barcodeData.text).subscribe(data => {
          if(data['status_verbose'] != "product not found"){
            this.barrecodeValue = data['product']['product_name'];
          } else {
            this.alertCtrl.create({
              title: 'Not found',
              subTitle: 'Sorry, this product is not referenced',
              buttons: ['Dismiss']
            }).present();
          }
        })
      }).catch(err => {
           console.log('Error', err);
       });
       
    }

}
