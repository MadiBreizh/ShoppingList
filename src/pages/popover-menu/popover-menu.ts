import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-popover-menu',
  templateUrl: 'popover-menu.html',
})
export class PopoverMenuPage {

  stateReorder : boolean = false;

  constructor(public viewCtrl: ViewController,
    public navParams:NavParams) {
      console.log(navParams.data);
      
      this.stateReorder = this.navParams.get('isReorder');
      console.log(this.stateReorder);
  }

  onAction(nameAction : string) {
    this.viewCtrl.dismiss(nameAction);
  }


}
