import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  public static URL_SEARCH = 'https://us-central1-tibell-test.cloudfunctions.net/servicio_auth_test';
  private headers = new HttpHeaders();

  constructor(
    private http: HttpClient,
  ) { }

  public login(user: any): Observable<any> {
    return Observable.create(observer => {
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
      const dataBinary = { email: user.username, password: user.password };
      this.http.post(`${RestApiService.URL_SEARCH}/login`, dataBinary, { headers: this.headers }).subscribe(data => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('There is not data for that request, please try again.');
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  public isAuthenticated(token): Observable<any> {
    return Observable.create(observer => {
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
      this.headers.append('Authorization', `Bearer ${token}`);
      this.http.get(`${RestApiService.URL_SEARCH}/isAuth`, { headers: { authorization: `Bearer ${token}` } }).subscribe(data => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('There is not data for that request, please try again.');
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  public logout(): Observable<any> {
    return Observable.create(observer => {
      this.headers.append('Content-Type', 'application/json');
      this.headers.append('Accept', 'application/json');
      this.http.get(`${RestApiService.URL_SEARCH}/logout`, { headers: this.headers }).subscribe(data => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('There is not data for that request, please try again.');
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  public getBusinesses(location: string): Observable<any> {
    return Observable.create(observer => {
      this.http.get(`${RestApiService.URL_SEARCH}/businesses/search`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          params: { location: JSON.stringify(location), offset: '0', limit: '50' }
        }).subscribe(data => {
        if (data) {
          observer.next(data);
        } else {
          observer.error('There is not data for that request, please try again.');
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  getBusinessesById(id: string): Observable<any> {
    return Observable.create(observer => {
      this.http.get(`${RestApiService.URL_SEARCH}/businesses/${id}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        params: { location: JSON.stringify(location), offset: '0', limit: '50' }
      }).subscribe(data => {
        if (data) {
          observer.next(data);
          observer.complete();
        } else {
          observer.error('There is not data for that request, please try again.');
        }
      }, error => {
        observer.error(error);
      });
    });
  }

  getBusinessesReviews(id: string): Observable<any> {
    return Observable.create(observer => {
      this.http.get(`${RestApiService.URL_SEARCH}/businesses/${id}/reviews`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        params: { location: JSON.stringify(location), offset: '0', limit: '50' }
      }).subscribe(data => {
        if (data) {
          observer.next(data);
          observer.complete();
        } else {
          observer.error('There is not data for that request, please try again.');
        }
      }, error => {
        observer.error(error);
      });
    });
  }
}
