import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class OfFactProvider {

  constructor(public http: HttpClient) {
  }

  getProductByBarre(barreCode : string){
    return this.http.get("https://fr.openfoodfacts.org/api/v0/produit/" + barreCode + ".json");
  }

}
