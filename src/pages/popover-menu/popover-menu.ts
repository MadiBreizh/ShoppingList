import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-popover-menu',
  templateUrl: 'popover-menu.html',
})
export class PopoverMenuPage {

  reorder : boolean = false;

  constructor(public viewCtrl: ViewController) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad PopoverMenuPage');
  // }

  close() {
    this.viewCtrl.dismiss();
  }
}
