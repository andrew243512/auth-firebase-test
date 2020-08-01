import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReviewsPageRoutingModule } from './reviews-routing.module';

import { ReviewsPage } from './reviews.page';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RestApiService } from 'src/app/services/rest-api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReviewsPageRoutingModule
  ],
  declarations: [ReviewsPage],
  providers: [
    RestApiService,
    HttpClient
  ]
})
export class ReviewsPageModule {}
