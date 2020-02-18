import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, from } from 'rxjs';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { map, tap, mergeMap, reduce, take } from 'rxjs/operators';
import { ProdStatus, Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class CheckedProductSetService {

  prodNoSet = new Set();
  hasNo$: Observable<boolean>;
  private hasNoSubject: Subject<boolean> = new BehaviorSubject(false);

  private database: DataStoreService;

  constructor() {
    this.hasNo$ = this.hasNoSubject.asObservable();
   }

   initProdNos(){
     this.prodNoSet = new Set();
     this._notifyExistence();
   }

   addNo(no: number){
     this.prodNoSet.add(no);
     this._notifyExistence();
   }

   removeNo(no: number){
     this.prodNoSet.delete(no);
     this._notifyExistence();
   }

   nos$(){
     // TODO 
     return from([1, 2, 3, 4, 5]);
    // return Observable.from(Array.from(this.prodNoSet));
    
    // return from(Array.from(this.prodNoSet)).
    //   pipe(
    //   mergeMap(no => this.database.findObject$<Product>('product', no))
   }

   private _notifyExistence(){
     const hasNo = this.prodNoSet.size > 0;
     this.hasNoSubject.next(hasNo);
   }
}
