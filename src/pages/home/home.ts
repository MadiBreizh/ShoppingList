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

  products : Promise<Product[]>;
  stateReorder : boolean = false;

  constructor(public navCtrl: NavController,
  private productService : ProductService,
  private translate: TranslateService,
  private alertCtrl: AlertController) {
    translate.setDefaultLang('fr');
  }

  ionViewWillEnter(){
    this.products = this.getAllProduct();
      
  }

  addProduct(){
    this.navCtrl.push(AddProductPage);
  }

  getAllProduct(){
    return this.productService.getAllProducts();
  }

  onSetProduct( product : Product){
    this.productService.onSetProduct(product);
    this.products = this.getAllProduct();    
  }

  onDeleteOne(item : ItemSliding, product : Product){
    this.productService.onDeleteOneProduct(product);
    this.products = this.getAllProduct();    
    item.close(); 
  }

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
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: msgTranslate.confirm,
          handler: () => {
            this.productService.onDeleteProductChecked();
            this.products = this.getAllProduct();
          }
        }
      ]
    }).present();

  }

  onReorder(){
    this.stateReorder = !this.stateReorder;
  }

  onModify(item : ItemSliding, product : Product){
    
  }

  reorderItems(indexes) {
    this.productService.reorderItems(indexes);
    this.products = this.getAllProduct(); 
  }

}
