// Decorators
import { Injectable } from '@angular/core';

// RXJS
import { Observable } from 'rxjs';

// HTTP
import { HttpClient } from '@angular/common/http';

// Models
import { ServerResponse } from '../models/server-response.model';
import { product } from '../models/product.model';

const domain = 'http://localhost:8000';
const getSingleproductEndpoint = domain + '/product/details/';
const createproductEndpoint = domain + '/product/add';
const editproductEndpoint = domain + '/product/edit/';
const deleteproductEndpoint = domain + '/product/delete/';
const rateproductEndpoint = domain + '/product/rate/';
const addToFavoritesEndpoint = domain + '/product/addToFavorites/';
const searchproductEndpoint = domain + '/product/search';

@Injectable({
  providedIn: 'root'
})
export class productService {

  constructor(private http: HttpClient) { }

  getSingleproduct(id: string): Observable<ServerResponse<product>> {
    return this.http.get<ServerResponse<product>>(getSingleproductEndpoint + id);
  }

  createproduct(payload: product): Observable<ServerResponse<product>> {
    return this.http.post<ServerResponse<product>>(createproductEndpoint, payload);
  }

  editproduct(id: string, payload: product): Observable<ServerResponse<product>> {
    return this.http.put<ServerResponse<product>>(editproductEndpoint + id, payload);
  }

  deleteproduct(id: string): Observable<ServerResponse<product>> {
    return this.http.delete<ServerResponse<product>>(deleteproductEndpoint + id);
  }

  rateproduct(id: string, payload: object): Observable<ServerResponse<product>> {
    return this.http.post<ServerResponse<product>>(rateproductEndpoint + id, payload);
  }

  addToFavourites(id: string): Observable<ServerResponse<product>> {
    return this.http.post<ServerResponse<product>>(addToFavoritesEndpoint + id, {});
  }

  search(query: string): Observable<ServerResponse<product[]>> {
    return this.http.get<ServerResponse<product[]>>(searchproductEndpoint + query);
  }
}
