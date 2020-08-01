import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';

import { ReviewsPage } from './reviews.page';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { APP_BASE_HREF } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ReviewsPage', () => {
  let component: ReviewsPage;
  let fixture: ComponentFixture<ReviewsPage>;
  let loadingCtl: any;
  const BUSINESS_ID = 'H4jJ7XB3CetIr1pg56CczQ';
  const BUSINESS_INFO = {
    alias: 'levain-bakery-new-york',
    categories: [{ alias: 'bakeries', title: 'Bakeries' }],
    coordinates: { latitude: 40.7773520936702, longitude: -73.980282552649 },
    display_phone: '(917) 464-3769',
    distance: 8082.367282240455,
    id: 'H4jJ7XB3CetIr1pg56CczQ',
    image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/zgjSt_RGjXQMJxYxYSo-bQ/o.jpg',
    is_closed: false,
    location: { address1: '1484 3rd Ave', address2: '', address3: '', city: 'New York', zip_code: '10023' },
    name: 'Levain Bakery',
    phone: '+19174643769',
    price: '$$',
    rating: 4.5,
    review_count: 8047,
    transactions: [],
    url: 'https://www.yelp.com/biz/levain-bakery-new-york?adjust_creative=QIta4g4-1fciUDzJg7Ug3A&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=QIta4g4-1fciUDzJg7Ug3A',
  };
  const BUSINESS_REVIEWS = [{
    id: 'tbVrDkNecDqLF0i4zTwzkw',
    rating: 5,
    text: 'You pretty much have to be doing everything right to get 5 stars from me. Levain deserves it! I\'ve seen it on The Best Thing I Ever Ate',
    time_created: '2020-04-29 14:57:53',
    url: 'https://www.yelp.com/biz/levain-bakery-new-york?adjust_creative=QIta4g4-1fciUDzJg7Ug3A&hrid=tbVrDkNecDqLF0i4zTwzkw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=QIta4g4-1fciUDzJg7Ug3A',
    user: {
      id: '9TLh-OPbwNQnYIeXPWtvDw',
      image_url: 'https://s3-media4.fl.yelpcdn.com/photo/qd446Tsg_7qeDenJO7W4dg/o.jpg',
      name: 'Esther T.',
      profile_url: 'https://www.yelp.com/user_details?userid=9TLh-OPbwNQnYIeXPWtvDw',
    }
  },
  {
    id: '1dfcsR8Q46ZkTeePEHQDkg',
    rating: 5,
    text: 'I must say, I placed my order through caviar and schedule my pick up, they notified me earlier that it was ready and was very impressed with how quickly.',
    time_created: '2020-05-08 14:54:09',
    url: 'https://www.yelp.com/biz/levain-bakery-new-york?adjust_creative=QIta4g4-1fciUDzJg7Ug3A&hrid=1dfcsR8Q46ZkTeePEHQDkg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_reviews&utm_source=QIta4g4-1fciUDzJg7Ug3A',
    user: {
      id: '9TLh-SHwNhoV6KwOXiVe7aaousg',
      image_url: 'https://s3-media1.fl.yelpcdn.com/photo/EYJjeDovl4lCvuY_bKQ4AA/o.jpg',
      name: 'John M.',
      profile_url: 'https://www.yelp.com/user_details?userid=SHwNhoV6KwOXiVe7aaousg',
    }
  }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewsPage],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        HttpClientModule,
      ],
      providers: [
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: LoadingController,
          useValue: {
            create: () => Promise.resolve(),
            present: () => Promise.resolve(),
            dismiss: () => Promise.resolve()
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: BUSINESS_ID })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsPage);
    component = fixture.componentInstance;

    loadingCtl = TestBed.get(LoadingController);
    fixture.detectChanges();
  }));

  it('should create Page', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));

  describe('Busineess Reviews', () => {
    it('should load default values', fakeAsync(() => {
      expect(component.id).toEqual(BUSINESS_ID);
      component.business = BUSINESS_INFO;
      component.reviews = BUSINESS_REVIEWS;

      fixture.detectChanges();
      expect(component.reviews.length).toEqual(2);

      const cardImg = fixture.debugElement.queryAll(By.css('.img-label'));
      expect(cardImg).toBeTruthy();
      expect(cardImg.length).toBe(2);
      expect(cardImg[0].nativeElement.src).toBe(component.reviews[0].user.image_url);
      expect(cardImg[1].nativeElement.src).toBe(component.reviews[1].user.image_url);

      const labelNameEL = fixture.debugElement.queryAll(By.css('.name-label'));
      expect(labelNameEL).toBeTruthy();
      expect(labelNameEL.length).toBe(2);
      expect(labelNameEL[0].nativeElement.innerText.trim()).toBe(component.reviews[0].user.name);
      expect(labelNameEL[1].nativeElement.innerText.trim()).toBe(component.reviews[1].user.name);

      const labelReviewEL = fixture.debugElement.queryAll(By.css('.review-label'));
      expect(labelReviewEL).toBeTruthy();
      expect(labelReviewEL.length).toBe(2);
      expect(labelReviewEL[0].nativeElement.innerText.trim()).toBe(`Review: ${component.reviews[0].text}`);
      expect(labelReviewEL[1].nativeElement.innerText.trim()).toBe(`Review: ${component.reviews[1].text}`);

      const labelRatingEL = fixture.debugElement.queryAll(By.css('.rating-label'));
      expect(labelRatingEL).toBeTruthy();
      expect(labelRatingEL.length).toBe(2);
      expect(labelRatingEL[0].nativeElement.innerText.trim()).toBe(`Rating: ${component.reviews[0].rating}`);
      expect(labelRatingEL[1].nativeElement.innerText.trim()).toBe(`Rating: ${component.reviews[1].rating}`);
    }));
  });
});
