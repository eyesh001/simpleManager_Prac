import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './scm-main/page-not-found/page-not-found.component';
import { MainDashboardComponent } from './scm-main/main-dashboard/main-dashboard.component';
import { ProductManagementComponent } from './product/product-management/product-management.component';
import { CategoryManagementComponent } from './category/category-management/category-managemnet.component';
import { SessionAuthGuardService } from './shared/session-auth-guard.service';
import { ProductListResolverService } from './product/product-management/product-list/product-list-resolver.service';
import { ProductDetailResolverService } from './product/product-detail/product-detail-resolver.service';
import { CanDeactivateGuardService } from './shared/can-deactivate-guard.service';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { CategoryListResolverService } from './category/category-management/category-list-resolver.service';
import { CategoryDetailResolverService } from './category/category-detail/category-detail-resolver.service';
import { CategoryDetailComponent } from './category/category-detail/category-detail.component';


const routes: Routes = [
  {
    path: 'product-list', children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [SessionAuthGuardService],
        resolve: { list: ProductListResolverService },
        component: ProductManagementComponent
      },
      {
        path: 'product/:no',
        resolve: { detail: ProductDetailResolverService },
        canDeactivate: [CanDeactivateGuardService],
        component: ProductDetailComponent
      }
    ]
  },
  {
    path: 'category-list', children: [
      { path: '', pathMatch: 'full', resolve: { list: CategoryListResolverService }, component: CategoryManagementComponent },
      { path: 'category/:no', resolve: { category: CategoryDetailResolverService }, component: CategoryDetailComponent },
    ]
  },
  { path: '', component: MainDashboardComponent },
  { path: '', redirectTo: 'total-summary', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
