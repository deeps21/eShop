// Decorators
import { NgModule } from '@angular/core';

// Modules
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../core/shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';

// Components
import { ProductCreateComponent } from './Product-create/Product-create.component';
import { ProductEditComponent } from './Product-edit/Product-edit.component';
import { ProductDeleteComponent } from './Product-delete/Product-delete.component';
import { ProductDetailsComponent } from './Product-details/Product-details.component';
import { ProductStoreComponent } from './Product-store/Product-store.component';

@NgModule({
  declarations: [
    ProductCreateComponent,
    ProductEditComponent,
    ProductDeleteComponent,
    ProductDetailsComponent,
    ProductStoreComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    ProductRoutingModule
  ],
})
export class ProductModule { }
