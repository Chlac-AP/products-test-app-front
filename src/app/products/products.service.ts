import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, map, Observable, of, take, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';

import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private _products: BehaviorSubject<Product[]> = new BehaviorSubject([]);

  public readonly products: Observable<Product[]> = this._products.asObservable();
  public readonly product_categories: Observable<Set<string>> = this.products.pipe(map(products => new Set(products.map(p => p.category))));

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  loadInitialData() {
    //this.http.get<any>('assets/products.json').pipe(map(res => res.data)).subscribe(products => this._products.next(products))
    this.http.get<any>(`${environment.apiUrl}/products`).subscribe(products => this._products.next(products))
  }

  // TODO: Make reactive to changes / pretty observable. #flemme-for-now
  getProductsCategories() {
    return this.product_categories;
  }

  getProducts(): Observable<Product[]> {
    return this.products;
  }

  addProducts(products: Partial<Product>[]): Observable<any> {
    // TODO : Replace of(EMPTY) with post request, and receive added products in response
    return this.http.post<any>(`${environment.apiUrl}/products`, products).pipe(
      take(1),
      tap(
        res => {

          this._products.next(this._products.getValue().concat(products.map(p => ({
            ...p,
            id: this.createId(),
            code: this.createCode(),
            inventoryStatus: p.quantity > 0 ? p.quantity > 10 ? 'INSTOCK' : 'LOWSTOCK' : 'OUTOFSTOCK',
          }) as Product
          )));

        }
      ));
  }

  updateProducts(products_to_update: Product[]): Observable<any> {
    // TODO : Replace of(EMPTY) with update request, and receive updated products in response
    return this.http.put<any>(`${environment.apiUrl}/products`, products_to_update).pipe(
      take(1),
      tap(
        res => {
          const products = this._products.getValue()
          products_to_update.forEach(p => products[this.findIndexById(p.id)] = p)
          this._products.next([...products])
        }
      ));
  }


  deleteProducts(products: Product[]): Observable<any> {
    // TODO : Replace of(EMPTY) with delete request, and maybe receive updated product list in response
    return this.http.delete<any>(`${environment.apiUrl}/products`, { body: products }).pipe(
      take(1),
      tap(
        res => {
          this._products.next(this._products.getValue().filter(p => !products.find(_p => _p.id == p.id)));
        }
      )
    )
  }

  // TODO : All below probably obsolete once backend ready
  findIndexById(id: number): number {

    const products = this._products.getValue()

    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): number {
    return this._products.getValue().length;
  }

  createCode(): string {
    let code = '';
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 9; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

}
