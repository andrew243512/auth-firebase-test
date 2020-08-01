import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { IonicModule, LoadingController } from '@ionic/angular';

import { HomePage } from './home.page';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  const formBuilder: FormBuilder = new FormBuilder();
  let loadingCtl: any;
  let searchForm: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [
        IonicModule.forRoot(),
        RouterModule.forRoot([]),
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
      providers: [
        FormBuilder,
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: LoadingController,
          useValue: {
            create: () => Promise.resolve(),
            present: () => Promise.resolve(),
            dismiss: () => Promise.resolve()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;

    searchForm = component.searchForm;
    loadingCtl = TestBed.get(LoadingController);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load default values', () => {
    expect(component.searchForm.get('searchInput').value).toEqual('');
  });

  it('should detect Initial state', () => {
    expect(component.search).toEqual(false);
    expect(component.searchForm.valid).toEqual(false);
  });

  it('should validate correct searchInput info', () => {
    const searchInput = searchForm.controls.searchInput;
    searchInput.setValue('New York');
    expect(searchForm.invalid).toBeFalsy();
    fixture.nativeElement.querySelector('ion-button').click();
    component.loading = loadingCtl;
    expect(component.search).toEqual(true);
    expect(component.searchForm.valid).toEqual(true);
  });

  it('should show correct location info', () => {
    const searchInput = searchForm.controls.searchInput;
    searchInput.setValue('New York');
    fixture.detectChanges();
    const searchBar = fixture.nativeElement.querySelector('ion-searchbar');
    const searchText = searchBar.querySelector('input');
    expect(searchText).toBeTruthy();
    expect(searchText.value).toBe('New York');
  });

  it('should show empty location info', () => {
    fixture.detectChanges();
    const searchBar = fixture.nativeElement.querySelector('ion-searchbar');
    const searchText = searchBar.querySelector('input');
    expect(searchText).toBeTruthy();
    expect(searchText.value).toBe('');
  });

  describe('businesses by Location', () => {
    let businesses;
    beforeEach(() => {
      businesses = [{
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
      },
      {
        alias: 'katzs-delicatessen-new-york',
        categories: [{ alias: 'delis', title: 'Delis' }, { alias: 'sandwiches', title: 'Sandwiches' }],
        coordinates: { latitude: 40.722237, longitude: -73.98743 },
        display_phone: '(212) 254-2246',
        distance: 1954.7472206615387,
        id: 'V7lXZKBDzScDeGB8JmnzSA',
        image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/B6xNx79cSE7bFxqERBYOhg/o.jpg',
        is_closed: false,
        location: { address1: '205 E Houston St', address2: '', address3: '', city: 'New York', zip_code: '10003' },
        name: 'Katz\'s Delicatessen',
        phone: '+12122542246',
        price: '$$',
        rating: 4,
        review_count: 12243,
        transactions: ['pickup', 'delivery'],
        url: 'https://www.yelp.com/biz/katzs-delicatessen-new-york?adjust_creative=QIta4g4-1fciUDzJg7Ug3A&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=QIta4g4-1fciUDzJg7Ug3A'
      }];
    });
    it('should display cards of all businesses by Location', () => {
      component.businesses = businesses;
      component.search = true;
      fixture.detectChanges();
      expect(component.businesses.length).toEqual(2);
      const cardImg = fixture.debugElement.queryAll(By.css('.business-img'));
      expect(cardImg).toBeTruthy();
      expect(cardImg.length).toBe(2);
      expect(cardImg[0].nativeElement.src).toBe(component.businesses[0].image_url);
      expect(cardImg[1].nativeElement.src).toBe(component.businesses[1].image_url);

      const cardTitle = fixture.debugElement.queryAll(By.css('.busTitle'));
      expect(cardTitle).toBeTruthy();
      expect(cardTitle.length).toBe(2);
      expect(cardTitle[0].nativeElement.innerText.trim()).toBe(component.businesses[0].name);
      expect(cardTitle[1].nativeElement.innerText.trim()).toBe(component.businesses[1].name);

      const cardPhone = fixture.debugElement.queryAll(By.css('.busPhone'));
      expect(cardPhone).toBeTruthy();
      expect(cardPhone.length).toBe(2);
      expect(cardPhone[0].nativeElement.innerText.trim()).toBe(`Phone: ${component.businesses[0].display_phone}`);
      expect(cardPhone[1].nativeElement.innerText.trim()).toBe(`Phone: ${component.businesses[1].display_phone}`);

      const ratingCard = fixture.debugElement.queryAll(By.css('.busRating'));
      expect(ratingCard).toBeTruthy();
      expect(ratingCard.length).toBe(2);
      expect(ratingCard[0].nativeElement.innerText.trim()).toBe(`Rating: ${component.businesses[0].rating}`);
      expect(ratingCard[1].nativeElement.innerText.trim()).toBe(`Rating: ${component.businesses[1].rating}`);

      const reviewsCard = fixture.debugElement.queryAll(By.css('.busReviews'));
      expect(reviewsCard).toBeTruthy();
      expect(reviewsCard.length).toBe(2);
      expect(reviewsCard[0].nativeElement.innerText.trim()).toBe(`Reviews: ${component.businesses[0].review_count}`);
      expect(reviewsCard[1].nativeElement.innerText.trim()).toBe(`Reviews: ${component.businesses[1].review_count}`);
    });
  });
});
