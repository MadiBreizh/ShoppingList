import {
  Component
} from '@angular/core';
import {
  NavController,
  ItemSliding,
  PopoverController,
  LoadingController
} from 'ionic-angular';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  AlertController
} from 'ionic-angular';
import {
  EmailComposer
} from '@ionic-native/email-composer';


// SERVICES
import {
  ProductService
} from '../../providers/product-service/product-service';


// MODELS
import {
  Product
} from '../../models/product.model';
import {
  OfFactProvider
} from '../../providers/of-fact/of-fact';
import {
  BarcodeScanner
} from '@ionic-native/barcode-scanner';
import {
  PopoverMenuPage
} from '../popover-menu/popover-menu';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  activeMenu: string;

  private items: Promise < Product[] > ;
  private stateReorder: boolean = false;
  filterValue: string = '';
  productValue: string = "";

  constructor(public navCtrl: NavController,
    private productService: ProductService,
    private translate: TranslateService,
    private alertCtrl: AlertController,
    private emailComposer: EmailComposer,
    private offactService: OfFactProvider,
    private barcodeScanner: BarcodeScanner,
    private loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController
  ) {
    translate.setDefaultLang('fr');
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverMenuPage, {isReorder : this.stateReorder});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {      
      switch(popoverData){
        case "onSend" : {
          this.sendEmail();
          break;
        }
        case "onDeleteAll" : {
          this.onDeleteAll();
          break;
        }
        case "onReorder" : {
          this.onReorder();
          break;
        }
        case "onAbout" : {
          break;
        }
      }
      
    })
  }

  ionViewWillEnter() {
    this.items = this.getAllProduct();
  }

  sendEmail() {
    let email = {
      subject: 'Shopping list',
      body: this.productService.strigifyProduct(),
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  filterItems(ev: any) {
    ev.target.value ? this.filterValue = ev.target.value.trim() : this.filterValue = '';
    this.items = this.getAllProduct();
  }

  // call list of product item
  getAllProduct() {
    return this.productService.getAllProducts(this.filterValue);
  }

  // set an item clicked to became checked
  onSetProduct(product: Product) {
    this.productService.onSetItem(product.date);
    this.items = this.getAllProduct();
  }

  // edit an item product
  onEditItem(row: ItemSliding, product: Product) {
    let msgTranslate: any = {};
    this.translate.get(['ALERT_EDIT_INPUT', 'CANCEL', 'CONFIRM']).subscribe(text => {
      msgTranslate.title = text['ALERT_EDIT_INPUT'];
      msgTranslate.cancel = text['CANCEL'];
      msgTranslate.confirm = text['CONFIRM'];
    });

    this.alertCtrl.create({
      title: msgTranslate.title,
      inputs: [{
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
      buttons: [{
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
  onDeleteOne(row: ItemSliding, product: Product) {
    this.productService.onDeleteOneProduct(product.date);
    this.items = this.getAllProduct();
    row.close();
  }

  // delete all item product checked with confirm message
  onDeleteAll() {
    let msgTranslate: any = {};
    this.translate.get(['ALERT_DELETE_CHECKED',
      'confirmMsgDeleteChecked',
      'CONFIRM',
      'CANCEL'
    ]).subscribe(text => {
      msgTranslate.title = text["ALERT_DELETE_CHECKED"];
      msgTranslate.message = text["confirmMsgDeleteChecked"];
      msgTranslate.confirm = text["CONFIRM"];
      msgTranslate.cancel = text["CANCEL"];
    });

    this.alertCtrl.create({
      title: msgTranslate.title,
      message: msgTranslate.message,
      buttons: [{
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

  onReorder() {
    // Repop all item before reorder
    if(this.filterValue != ''){
      this.filterValue='';
      this.items = this.getAllProduct();
    }
    this.stateReorder = !this.stateReorder;
  }

  // change position of product item for the new position
  reorderItems(indexes) {
    this.productService.reorderItems(indexes);
    this.items = this.getAllProduct();
  }

  onScan() {
    this.barcodeScanner.scan().then(barcodeData => {
      let loading = this.productLoading(barcodeData.text);
      loading.present();
      this.offactService.getProductByBarre(barcodeData.text).subscribe(data => {
        loading.dismiss();
        if (data['status_verbose'] != "product not found") {
          this.productValue = data['product']['product_name'];
        } else {
          // TODO : add to utils
          this.alertCtrl.create({
            title: 'Not found',
            subTitle: 'Sorry, this product is not referenced',
            buttons: ['Dismiss']
          }).present();
        }
      })
    }).catch(err => {
      this.alertCtrl.create({
        title: 'Error',
        subTitle: 'We can\'t load information from internet' ,
        buttons: ['Dismiss']
      }).present();
    });
  }

  // TODO : add to utils
  productLoading(barcode: string) {
    return this.loadingCtrl.create({
      spinner: 'dots',
      content: 'We find product : ' + barcode
    });
  }

  onAddProduct() {
    this.productService.saveProduct(this.productValue);
    this.productValue = "";
    this.items = this.getAllProduct();
  }

}
