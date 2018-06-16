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
    this.productService.onSetItem(product);
    this.products = this.getAllProduct();    
  }

  onEditItem(item : ItemSliding, product : Product){
    let productEdit = Object.assign({}, product);
    
    let msgTranslate: any = {};
    this.translate.get(['ALERT_EDIT_INPUT','CANCEL', 'CONFIRM']).subscribe(text => {
      msgTranslate.title = text['ALERT_EDIT_INPUT'];
      msgTranslate.cancel = text['CANCEL'];
      msgTranslate.confirm = text['CONFIRM'];
    });
    

      let alert = this.alertCtrl.create({
        title: msgTranslate.title,
        inputs: [
          {
            name: 'name',
            value: productEdit.name,
            type: 'text'
          
          },
          {
            name: 'quantity',
            value: String(productEdit.quantity),
            type: 'number'
          }
        ],
        buttons: [
          {
            text: msgTranslate.cancel,
            role: 'cancel',
            handler: data => {
            }
          },
          {
            text: msgTranslate.confirm,
            handler: data => {
              // implement controle input
              productEdit.name = data.name;
              productEdit.quantity = data.quantity;
              this.productService.onEditItem(productEdit);
              this.products = this.getAllProduct(); 
            }
          }
        ]
      });
      alert.present();
      item.close();

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


  reorderItems(indexes) {
    this.productService.reorderItems(indexes);
    this.products = this.getAllProduct(); 
  }

}
