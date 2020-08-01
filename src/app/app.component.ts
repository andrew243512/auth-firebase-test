import { Component, OnInit } from '@angular/core';

import { Platform, Config } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoaderService } from './services/loading/loading.service';
import { RestApiService } from './services/rest-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Establecimientos',
      url: '/home',
      icon: 'pizza'
    }
  ];
  defaultStatusBarColor = '#f8f8f8';
  token: string;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public config: Config,
    public loaderService: LoaderService,
    private restApiService: RestApiService,
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    const path = window.location.pathname.split('pages/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  initializeApp() {
    this.config.set('scrollPadding', false);
    this.config.set('scrollAssist', false);

    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleDefault();
        this.statusBar.backgroundColorByHexString(this.defaultStatusBarColor);
      } else {
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByName('black');
      }
      this.token = localStorage.getItem('token');
      this.platform.backButton.subscribeWithPriority(9999, () => {
        if (this.router.url === '/home' && this.restApiService.isAuthenticated(this.token)) {
          document.addEventListener('backbutton', (event) => {
            event.preventDefault();
            event.stopPropagation();
          }, false);
        } else if ((this.router.url === '/login' && !this.restApiService.isAuthenticated(this.token))) {
          document.addEventListener('backbutton', (event) => {
            event.preventDefault();
            event.stopPropagation();
          }, false);
        } else {
          window.history.back();
        }
      });

      this.restApiService.isAuthenticated(this.token).subscribe(authResp => {
        if (authResp) {
          this.splashScreen.hide();
          // this.loaderService.dismissLoader();
          this.router.navigateByUrl(`/home`);
        } else {
          this.splashScreen.hide();
          // this.loaderService.dismissLoader();
          this.router.navigateByUrl(`/login`);
        }
      }, error => {
        this.splashScreen.hide();
        // this.loaderService.dismissLoader();
        this.router.navigateByUrl(`/login`);
        console.log(error);
      });

    });
  }

  logout() {
    const content = `<div class="custom-spinner-container">
                   <div class="custom-spinner-box">Cerrando sesión</div>
               </div>`;
    this.loaderService.presentLoader(content);
    this.restApiService.logout().subscribe((data) => {
      localStorage.clear();
      setTimeout(() => {
        this.loaderService.dismissLoader();
        this.router.navigateByUrl(`/login`);
      }, 1000);
    }, err => {
      console.log('Error Logout', err);
      localStorage.clear();
      setTimeout(() => {
        this.loaderService.dismissLoader();
        this.router.navigateByUrl(`/login`);
      }, 1000);
    });
  }

}
