import { RestApiService } from './rest-api.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import {
  HttpBackend,
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';

describe('RestApiService', () => {
  let service: RestApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [
        RestApiService,
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = new RestApiService(httpClient);
  });

  it('exists RestApiService', inject([RestApiService], (service: RestApiService) => {
    expect(service).toBeTruthy();
  }));

  describe('business', () => {
    it('gets business from New York', () => {
      service.getBusinesses('New york').subscribe(x => {
        expect(x.business.length).toEqual(1);
        expect(x.message).toEqual('success');
      });
      const req = httpTestingController.expectOne(
        'http://localhost:1000/businesses/search?location=%22New%20york%22&offset=0&limit=50'
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        business: [{ name: 'Levain Bakery', phone: '+19174643769' }],
        message: 'success'
      });
      httpTestingController.verify();
    });


    it('get Info business by Id', () => {
      service.getBusinessesById('H4jJ7XB3CetIr1pg56CczQ').subscribe(x => {
        expect(x.id).toEqual('H4jJ7XB3CetIr1pg56CczQ');
        expect(x.name).toEqual('Levain Bakery');
        expect(x.message).toEqual('success');
      });
      const req = httpTestingController.expectOne(
        'http://localhost:1000/businesses/H4jJ7XB3CetIr1pg56CczQ'
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        name: 'Levain Bakery', phone: '+19174643769', id: 'H4jJ7XB3CetIr1pg56CczQ',
        message: 'success'
      });
      httpTestingController.verify();
    });


    it('get reviews info business by Id', () => {
      service.getBusinessesReviews('H4jJ7XB3CetIr1pg56CczQ').subscribe(x => {
        expect(x.id).toEqual('H4jJ7XB3CetIr1pg56CczQ');
        expect(x.name).toEqual('Levain Bakery');
        expect(x.message).toEqual('success');
      });
      const req = httpTestingController.expectOne(
        'http://localhost:1000/businesses/H4jJ7XB3CetIr1pg56CczQ/reviews'
      );
      expect(req.request.method).toEqual('GET');
      req.flush({
        name: 'Levain Bakery', phone: '+19174643769', id: 'H4jJ7XB3CetIr1pg56CczQ',
        message: 'success'
      });
      httpTestingController.verify();
    });
  });
});
