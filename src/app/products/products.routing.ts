import { RouterModule, Routes } from "@angular/router";
import { ProductsComponent } from "./products/products.component";
import { ProductsAdminComponent } from "./products-admin/products-admin.component";

const productsRoutes: Routes = [
    { path: 'products',
      children: [
        { path: '', component: ProductsComponent },
        { path: 'admin', component: ProductsAdminComponent }
      ]
    }
  ];
  
  export const ProductsRouting = RouterModule.forChild(productsRoutes);