import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { LoaderService } from 'src/app/services/loading/loading.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegistroPage implements OnInit, OnDestroy {
  private static readonly TEXTS = {
    DEFAULT_ERROR: 'Se ha presentado un error autenticandose',
    INVALID_EMAIL: 'Error en el correo',
    PASSWORD_REQUIRED: 'Contraseña requerida',
  };
  errorMsg: string;
  subscriptionHanlder: Subscription;
  onSignUpForm: FormGroup;
  token: any;
  loading = false;
  user: any;
  constructor(
    private formBuilder: FormBuilder,
    private restApiService: RestApiService,
    private router: Router,
    public loadingController: LoadingController,
    public loaderService: LoaderService,
    public toastCtrl: ToastController
  ) {
    this.onSignUpForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionHanlder) {
      this.subscriptionHanlder.unsubscribe();
    }
  }

  registro({ username, password }) {
    this.loading = true;
    const email = username.value.toLowerCase();
    const pass = password.value;

    if (!username.valid) {
      this.loading = false;
      return this.showErrorMessage(RegistroPage.TEXTS.INVALID_EMAIL);
    }
    if (!password.valid) {
      this.loading = false;
      return this.showErrorMessage(RegistroPage.TEXTS.PASSWORD_REQUIRED);
    }
    setTimeout(() => {
      this.loaderService.dismissLoader();
    }, 75000);
    this.loaderService.presentLoader();
    this.subscriptionHanlder = this.restApiService.signup({
      username: this.onSignUpForm.value.username, password: this.onSignUpForm.value.password
    }).subscribe((responseData) => {
      this.token = responseData && responseData.token ? responseData.token : [];
      localStorage.setItem('token', this.token);
      this.loading = false;
      this.loaderService.dismissLoader();
      this.router.navigateByUrl(`/home`);
    }, err => {
      this.loading = false;
      console.log(err);
      const errorCode = err.status;
      if (errorCode) {
        switch (errorCode) {
          case 400:
            this.errorMsg = err.error;
            break;
          default:
            this.errorMsg = 'Error en la solicitud actual, intente más tarde.';
        }
      } else {
        this.errorMsg = 'El servidor no puede o no procesará la solicitud debido a un aparente error del cliente (por ejemplo, sintaxis de solicitud con formato incorrecto, tamaño demasiado grande, enmarcado de mensaje de solicitud no válido o enrutamiento de solicitud engañoso)';
      }
      this.showErrorMessage(this.errorMsg);
      this.loaderService.dismissLoader();
    });
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
