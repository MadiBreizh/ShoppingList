import { Component } from '@angular/core';
import { NavController, ItemSliding } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';

// SERVICES
import { ProductService } from '../../providers/product-service/product-service';

// PAGES
import { AddProductPage } from '../add-product/add-product';

// MODELS
import { Product } from '../../models/product.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private items : Promise<Product[]>;
  private stateReorder : boolean = false;

  constructor(public navCtrl: NavController,
  private productService : ProductService,
  private translate: TranslateService,
  private alertCtrl: AlertController) {
    translate.setDefaultLang('fr');
  }

  ionViewWillEnter(){
    this.items = this.getAllProduct();
  }

  // change view to create new Product item
  addProduct(){
    this.navCtrl.push(AddProductPage);
  }

  // call list of product item
  getAllProduct(){
    return this.productService.getAllProducts();
  }

  // set an item clicked to became checked
  onSetProduct( product : Product){
    this.productService.onSetItem(product);
    this.items = this.getAllProduct();    
  }

  // edit an item product
  onEditItem(row : ItemSliding, product : Product){
    let msgTranslate: any = {};
    this.translate.get(['ALERT_EDIT_INPUT','CANCEL', 'CONFIRM']).subscribe(text => {
      msgTranslate.title = text['ALERT_EDIT_INPUT'];
      msgTranslate.cancel = text['CANCEL'];
      msgTranslate.confirm = text['CONFIRM'];
    });
    
    this.alertCtrl.create({
      title: msgTranslate.title,
      inputs: [
        {
          name: 'name',
          value: product.name,
          type: 'text'
        
        },
        {
          name: 'quantity',
          value: String(product.quantity),
          type: 'number'
        }
      ],
      buttons: [
        {
          text: msgTranslate.cancel,
          role: 'cancel'
        },
        {
          text: msgTranslate.confirm,
          handler: data => {
            // implement controle input
            product.name = data.name;
            product.quantity = data.quantity;
            this.productService.onEditItem(product);
            this.items = this.getAllProduct(); 
          }
        }
      ]
    }).present();
    row.close();

  }

  // delete an item product
  onDeleteOne(row : ItemSliding, product : Product){
    this.productService.onDeleteOneProduct(product);
    this.items = this.getAllProduct();    
    row.close(); 
  }

  // delete all item product checked with confirm message
  onDeleteAll() {
    let msgTranslate: any = {};
    this.translate.get(['ALERT_DELETE_CHECKED',
    'confirmMsgDeleteChecked',
    'CONFIRM',
    'CANCEL']).subscribe(text => {
      msgTranslate.title = text["ALERT_DELETE_CHECKED"];
      msgTranslate.message = text["confirmMsgDeleteChecked"];
      msgTranslate.confirm = text["CONFIRM"];
      msgTranslate.cancel = text["CANCEL"];
    });

    this.alertCtrl.create({
      title: msgTranslate.title,
      message: msgTranslate.message,
      buttons: [
        {
          text: msgTranslate.cancel,
          role: 'cancel'
        },
        {
          text: msgTranslate.confirm,
          handler: () => {
            this.productService.onDeleteProductChecked();
            this.items = this.getAllProduct();
          }
        }
      ]
    }).present();

  }

  // activ reorder to list product item
  onReorder(){
    this.stateReorder = !this.stateReorder;
  }

  // change position of product item for the new position
  reorderItems(indexes) {
    this.productService.reorderItems(indexes);
    this.items = this.getAllProduct(); 
  }

}
