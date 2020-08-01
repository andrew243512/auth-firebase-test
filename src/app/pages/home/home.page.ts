import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  searchForm: FormGroup;
  establecimientos: any[];
  loading: HTMLIonLoadingElement;
  subscriptionHanlder: Subscription;
  search = false;
  errorMsg: string;
  token: any;

  constructor(
    private formBuilder: FormBuilder,
    private restApiService: RestApiService,
    public loadingController: LoadingController,
    private router: Router,
    public toastCtrl: ToastController
  ) {
    this.searchForm = this.formBuilder.group({
      searchInput: ['', Validators.required],
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    if (this.subscriptionHanlder) {
      this.subscriptionHanlder.unsubscribe();
    }
  }

  searchBusiness() {
    if (this.searchForm && this.searchForm.valid) {
      this.presentLoadingWithOptions();
      this.search = true;
      this.subscriptionHanlder = this.restApiService.getBusinesses(this.searchForm.value.searchInput).subscribe((data) => {
        this.establecimientos = data && data.businesses
          ? data.businesses
          : [];
        this.loading.dismiss();
      }, err => {
        this.establecimientos = [];
        console.log(err);
        const errorCode = err.status;
        if (errorCode) {
          switch (errorCode) {
            case 400:
              this.errorMsg = err.error;
              break;
            case 401:
              this.errorMsg = 'Error obteniendo el token';
              break;
            default:
              this.errorMsg = 'Error en la solicitud actual, intente más tarde.';
          }
        } else {
          this.errorMsg = 'El servidor no puede o no procesará la solicitud debido a un aparente error del cliente (por ejemplo, sintaxis de solicitud con formato incorrecto, tamaño demasiado grande, enmarcado de mensaje de solicitud no válido o enrutamiento de solicitud engañoso)';
        }
        this.loading.dismiss();
        this.showErrorMessage(this.errorMsg);
      });
    }

  }

  seeReviews(id: string) {
    this.router.navigateByUrl(`/reviews/${id}`);
  }

  async presentLoadingWithOptions() {
    this.loading = await this.loadingController.create({
      spinner: 'bubbles',
      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true
    });
    await this.loading.present();
  }

  async showErrorMessage(msg) {
    const toast = await this.toastCtrl.create({
      message: msg ? msg : '',
      duration: 3500,
      position: 'top',
      animated: true,
      cssClass: 'toast-error'
    });

    toast.onDidDismiss()
      .then((data) => {
        console.log(data);
      });

    return await toast.present();
  }

}
