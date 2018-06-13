import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductService } from '../../providers/product-service/product-service';
import { AddProductPage } from '../add-product/add-product';
import { Product } from '../../models/product.model';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  products : Promise<Product[]>;

  constructor(public navCtrl: NavController,
  private productService : ProductService) {
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
}
