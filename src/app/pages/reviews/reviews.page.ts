import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit, OnDestroy {
  id: string;
  subscriptionHanlder: Subscription;
  errorMsg: string;
  reviews: any[];
  business: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private restApiService: RestApiService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      this.getReviewInfoByBusinessId();
    });
  }

  getReviewInfoByBusinessId(){
    if (this.id) {
      this.subscriptionHanlder = forkJoin([
        this.restApiService.getBusinessesReviews(this.id),
        this.restApiService.getBusinessesById(this.id)
      ]).subscribe(
        response => {
          this.reviews = response[0] && response[0].reviews
            ? response[0].reviews
            : [];

          this.business = response[1] && response[1]
            ? response[1]
            : [];
        }, error => {
          console.log(`Backend returned error was: ${error}`);
          this.reviews = [];
          console.log(error);
          const errorCode = error.status;
          if (errorCode) {
            switch (errorCode) {
              case 400:
                this.errorMsg = 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing';
                break;
              default:
                this.errorMsg = 'Error in the current request, please try later.';
            }
          } else {
            this.errorMsg = 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing';
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.subscriptionHanlder) {
      this.subscriptionHanlder.unsubscribe();
    }
  }
}
