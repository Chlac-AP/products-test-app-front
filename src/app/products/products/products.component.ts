import { Component, OnInit, ViewChild } from '@angular/core';

import { ProductsService } from '../products.service';
import { Observable, take } from 'rxjs';

import { PrimeNGConfig, SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from '../product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  @ViewChild('dv') dv!: DataView;

  $products: Observable<Product[]>

  sortOptions: SelectItem[];

  sortOrder: number;

  sortField: string;
  sortKey: any;

  constructor(private productService: ProductsService, private primengConfig: PrimeNGConfig) { }

  ngOnInit(): void {

    this.$products = this.productService.getProducts();

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
    
    this.primengConfig.ripple = true;

  }

  onSearchInput(event) {
    this.dv.filter(event.target.value)
  }

  onSortChange(event) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    }
    else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

}
