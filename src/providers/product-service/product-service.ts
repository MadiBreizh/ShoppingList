import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Storage } from '@ionic/storage'

@Injectable()
export class ProductService {


  private products: Product[] = [];

  constructor(public storage : Storage) {
  }

  // checked item selected by user
  onSetItem(product : Product) {
    for (let item of this.products) {
      console.log(item);
      if(item.date == product.date){
        item.valid ? item.valid = false : item.valid = true;
        return this.storage.set('products', this.products);
      }
    } 
  }

  // edit current item modify
  onEditItem(product : Product) {
    for (let item of this.products) {
      if(item.date == product.date){
        item.name = product.name;
        item.quantity = product.quantity;
        return this.storage.set('products', this.products);
      }
    }
  }

  // delete product
  onDeleteOneProduct(product : Product) {
    //End loop if product found
    for (let index = 0; index < this.products.length; index++) {
      if( this.products[index].date == product.date){
        this.products.splice(index, 1);
        return this.storage.set('products', this.products);
      }      
    }
  }

  // delete all products checked
  onDeleteProductChecked() {    
    for (let index = this.products.length-1; index >= 0 ; index--) {
      if( this.products[index].valid){
        this.products.splice(index, 1);
      }  
    }
    this.storage.set('products', this.products);
  }
  
  // assign new position items
  reorderItems(indexes) {
    let element = this.products[indexes.from];
    this.products.splice(indexes.from, 1);
    this.products.splice(indexes.to, 0, element);

    this.storage.set('products', this.products);
  }

  // save new entry
  saveProduct(product : Product){
    product.date = Date.now();
    product.valid = false;
    this.products.push(product);
    this.storage.set('products', this.products);
  }

  // return all items product
  getAllProducts(){
      return this.storage.get('products').then(
        (products) => {
          this.products = products == null ? [] : products;
          return [...this.products];
        }
      )
  }
}
