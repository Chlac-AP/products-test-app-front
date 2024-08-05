import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from '../product.model';
import { ProductsService } from '../products.service';
import { Observable, tap } from 'rxjs';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent implements OnInit {

  $products: Observable<Product[]>

  product: Partial<Product>;

  selectedProducts: Product[];

  product_keys: Array<keyof Product> = ["id", "code", "name", "description", "price", "quantity", "category"]
  displayedProductKeys: Array<keyof Product> = ["code", "name"];

  productDialog: boolean;

  submitted: boolean;

  @ViewChild('dt') dt!: Table;

  constructor(private productService: ProductsService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.$products = this.productService.getProducts().pipe(tap(ps => console.log(ps)));
  }

  getProductsCategories() {
    return this.productService.getProductsCategories();
  }

  onSearchInput(event, column) {
    this.dt.filter(event.target.value, column, 'contains')
  }


  openNew() {
    this.product = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      category: "Accessories",
    };
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProducts(this.selectedProducts)
          .subscribe({
            next: res => {
              this.selectedProducts = null;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
            },
            error: err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product failed to update', life: 3000 });
            }
          })

      }
    });
  }

  editProduct(product: Product) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProducts([product])
          .subscribe({
            next: res => {
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
            },
            error: err => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product failed to update', life: 3000 });
            }
          })
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name.trim()) {
      if (this.product.id) {
        this.productService.updateProducts([this.product as Product]).subscribe({
          next: res => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
          },
          error: err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product failed to update', life: 3000 });
          }
        })
      }
      else {
        this.product.image = 'product-placeholder.svg';
        this.productService.addProducts([this.product]).subscribe({
          next: res => {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          },
          error: err => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Product failed to update', life: 3000 });
          }
        })
      }

      this.productDialog = false;
      this.product = null;
    }
  }

}
