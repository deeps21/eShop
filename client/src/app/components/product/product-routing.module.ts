// Decorators
import { NgModule } from '@angular/core';

// Modules
import { RouterModule, Routes } from '@angular/router';

// Components
import { ProductCreateComponent } from './Product-create/Product-create.component';
import { ProductEditComponent } from './Product-edit/Product-edit.component';
import { ProductDeleteComponent } from './Product-delete/Product-delete.component';
import { ProductDetailsComponent } from './Product-details/Product-details.component';
import { ProductStoreComponent } from './Product-store/Product-store.component';

// Guards
import { IsAdminGuard } from '../../core/guards/is-admin.guard';

const ProductRoutes: Routes = [
  {
    path: '',
    redirectTo: 'store/default',
    pathMatch: 'full'
  },
  {
    path: 'store/:query',
    component: ProductStoreComponent
  },
  {
    path: 'details/:ProductId',
    component: ProductDetailsComponent
  },
  {
    path: 'create',
    canActivate: [IsAdminGuard],
    component: ProductCreateComponent
  },
  {
    path: 'edit/:ProductId',
    canActivate: [IsAdminGuard],
    component: ProductEditComponent
  },
  {
    path: 'delete/:ProductId',
    canActivate: [IsAdminGuard],
    component: ProductDeleteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(ProductRoutes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
