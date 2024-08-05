import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { ProductsComponent } from './products/products.component';
import { ProductsAdminComponent } from './products-admin/products-admin.component';

import { ProductsRouting } from './products.routing';


import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsAdminComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    ProductsRouting,
  ],
})
export class ProductsModule { }
