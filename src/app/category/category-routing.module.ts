import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryManagementComponent } from './category-management/category-managemnet.component';
import { CategoryDetailResolverService } from './category-detail/category-detail-resolver.service';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryListResolverService } from './category-management/category-list-resolver.service';


const routes: Routes = [
 {path: 'category-list', component: CategoryManagementComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [CategoryDetailResolverService, CategoryListResolverService]
})
export class CategoryRoutingModule {}
