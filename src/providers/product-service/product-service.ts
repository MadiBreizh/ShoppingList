import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Storage } from '@ionic/storage'

@Injectable()
export class ProductService {


  private products: Product[] = [];

  constructor(public storage : Storage) {
  }

  onSetItem(product : Product) {
    //TODO : End loop if product found
    for (let item of this.products) {
      if(item.date == product.date){
        item.valid ? item.valid = false : item.valid = true;
      }
    } 
    this.storage.set('products', this.products);
  }

  onEditItem(product : Product) {
    //TODO : End loop if product found
    for (let item of this.products) {
      if(item.date == product.date){
        item.name = product.name;
        item.quantity = product.quantity;
      }
    }
    
    this.storage.set('products', this.products);
  }

  onDeleteOneProduct(product : Product) {
    //End loop if product found
    for (let index = 0; index < this.products.length; index++) {
      if( this.products[index].date == product.date){
        this.products.splice(index, 1);
        break;
      }      
    }
    this.storage.set('products', this.products);
  }

  onDeleteProductChecked() {
    
    for (let index = this.products.length-1; index >= 0 ; index--) {
      if( this.products[index].valid){
        this.products.splice(index, 1);
      }  
    }
    this.storage.set('products', this.products);
  }
  
  reorderItems(indexes) {
    let element = this.products[indexes.from];
    this.products.splice(indexes.from, 1);
    this.products.splice(indexes.to, 0, element);

    this.storage.set('products', this.products);
  }

  saveProduct(product : Product){
    product.date = Date.now();
    product.valid = false;
    this.products.push(product);
    this.storage.set('products', this.products);
  }

  getAllProducts(){
      return this.storage.get('products').then(
        (products) => {
          this.products = products == null ? [] : products;
          return [...this.products];
        }
      )
  }
}
