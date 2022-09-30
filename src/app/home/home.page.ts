import { Component, OnDestroy, OnInit } from '@angular/core';
// import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import * as JsBarcode from 'jsbarcode';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  // https://www.npmjs.com/package/angularx-qrcode
  // https://www.npmjs.com/package/jsbarcode
  qrCodeString = 'This is a secret qr code message';
  barCodeString = '12345566765';
  scannedResult: any;
  // barScannedResult: any;
  content_visibility = '';

  constructor(
    // private barcodeScanner: BarcodeScanner
    ) {}

  ngOnInit(): void {
    JsBarcode("#barcode", this.barCodeString, {
      // format: "pharmacode",
      lineColor: "#0aa",
      width:4,
      height:200,
      displayValue: false
    });
  }

  // startScan() {
  //   this.barcodeScanner.scan().then(barcodeData => {
  //     console.log('Barcode data', barcodeData);
  //     this.scannedResult = barcodeData?.text;
  //    }).catch(err => {
  //        console.log('Error', err);
  //    });
  // }

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        return true;
      }
      return false;
    } catch(e) {
      console.log(e);
    }
  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      console.log(result);
      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if(result?.hasContent) {
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }

  ngOnDestroy(): void {
      this.stopScan();
  }

}
