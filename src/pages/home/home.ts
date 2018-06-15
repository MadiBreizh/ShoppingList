import { Component } from '@angular/core';
import { NavController, ItemSliding } from 'ionic-angular';

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
  stateReorder : boolean = true;

  constructor(public navCtrl: NavController,
  private productService : ProductService) {
  }

  ionViewWillEnter(){
    this.products = this.getAllProduct();
    console.log(this.products);
      
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

  onDelete(item : ItemSliding, product : Product){
    this.productService.onDeleteProduct(product);
    this.products = this.getAllProduct();    
    item.close(); 
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
