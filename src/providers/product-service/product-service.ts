import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Storage } from '@ionic/storage'

@Injectable()
export class ProductService {

  private products: Product[] = [];

  constructor(public storage : Storage) {
  }

  saveProduct(product : Product){
    product.date = Date.now();
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
