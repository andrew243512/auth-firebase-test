import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loading: HTMLIonLoadingElement;
  private isShowing = false;

  constructor(private loadingController: LoadingController) { }

  public async presentLoader(message?: string): Promise<void> {
    if (!this.isShowing) {
      this.loading = await this.loadingController.create({
        message: '',
        spinner: 'circles',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      this.isShowing = true;
      return this.loading.present();
    } else {
      // If loader is showing, only change text, won't create a new loader.
      this.isShowing = true;
      this.loading.message = message;
    }
  }

  public async dismissLoader(): Promise<void> {
    if (this.loading && this.isShowing) {
      this.isShowing = false;
      await this.loading.dismiss();
    }
  }
}
