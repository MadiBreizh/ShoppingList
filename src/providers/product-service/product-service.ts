import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { Storage } from '@ionic/storage'

@Injectable()
export class ProductService {

  private products: Product[] = [];

  constructor(public storage : Storage) {
  }

  // checked item selected by user
  onSetItem(createDate : Number) {
    let item  = this.products.find(elt => elt.date == createDate);    
    if(item !== undefined){
      item.valid ? item.valid = false : item.valid = true;
      this.storage.set('products', this.products);
    }
  }

  // return a string generate with current item product
  strigifyProduct(){
    let message : string = 'Contenu de la liste de course <br/> <br/>';
    message += '---<br>';
    this.products.forEach((item) => {
      if(!item.valid){
        message += item.quantity + 'x ' + item.name + '<br/>';
      }
    });
    message += '---<br><br> Cette liste a été générer par l\'application MyShoppingList';
    return message;
  }

  // edit current item modify
  onEditItem(product : Product) {
    let item  = this.products.find(elt => elt.date == product.date);
    if(item !== undefined){
      item = product;
      this.storage.set('products', this.products);
    }
  }

  // delete product
  onDeleteOneProduct(createDate : number) {
    this.products = this.products.filter((product) => {
      return product.date !== createDate
    })
    this.storage.set('products', this.products);
  }

  // delete all products checked
  onDeleteProductChecked() {
    this.products = this.products.filter((product) => {
      return product.valid !== true; 
    })
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
  getAllProducts(strFilter : string){
    return this.storage.get('products').then(
      (products : Product[]) => {
        if(products == null){
          this.products = [];
          return products;
        } else if (products.length == 0){
          return products;
        } else {
          this.products = products;
          return products.filter((item : Product) => {
            return item.name.toLowerCase().includes(strFilter.toLowerCase());
          }
        )
        }
      }
    )
  }
}
