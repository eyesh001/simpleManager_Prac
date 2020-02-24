import { Injectable, Inject } from '@angular/core';
import { take, tap, switchMap, map } from 'rxjs/operators';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { PROD_LIST_PAGE_SIZE } from '../../products.tokens';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Product, Products } from '../../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductListResolverService {

  constructor(
    private database: DataStoreService,
    @Inject(PROD_LIST_PAGE_SIZE) private pageSize: number) {
}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.database.count('product')
    .pipe(
      switchMap(cnt => this.database.findList$ByPage<Product>('product', 1, this.pageSize, cnt))
      , take(1)
      , map((actions:any) => actions.map(action => action.payload.val()))
      , tap((list: Products) => list.sort((p1, p2) => p2.no - p1.no))
    );
  }
}
