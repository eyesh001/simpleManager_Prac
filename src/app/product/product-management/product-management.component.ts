import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ProductListComponent } from './product-list/product-list.component';
import { NoCounterService } from 'src/app/shared/no-counter.service';
import { ProductBulkUpdaterService } from './product-bulk-updater.service';
import { PROD_LIST_PAGE_SIZE } from '../products.tokens';
// TODO: toastmessage 수정필요
@Component({
  selector: 'scm-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  totalItemCnt: number = 0;
  pageNo: number = 1;
  pageSize: number;
  clickedHandler: {sell: () => void, stop: () => void};
  // TODO:  https://stackoverflow.com/questions/56704164/angular-viewchild-error-expected-2-arguments-but-got-1
  @ViewChild(ProductListComponent, {static: false}) productListComponent: ProductListComponent;

  constructor(private counter: NoCounterService,
              private productBulkUpdater: ProductBulkUpdaterService,
              @Inject(PROD_LIST_PAGE_SIZE) pageSize: number) {
    this.pageSize = pageSize;
  }

  ngOnInit() {
    this.counter.get('product').subscribe(cnt => this.totalItemCnt = cnt);
    this.setBtnClickHandler();
  }

  pageNoChanged(pageNo) {
    this.pageNo = pageNo;
    this.productListComponent.pageNoChanged(this.pageNo);
  }

  pageSizeChanged(pageSize) {
    this.pageSize = +pageSize;
    this.productListComponent.pageSizeChanged(this.pageSize);
  }

  clickedBtn(btnEvent: string) {
    this.clickedHandler[btnEvent]();
  }

  private setBtnClickHandler() {
    const clickedSell = () => {
      this.productBulkUpdater.updateProductsToSell()
        .subscribe(
          (successIds) => {
            this.productListComponent.getPagedList();
           // this.toastr.success(`상품 판매 변경 성공<br>ID: ${successIds.join(', ')}`, '[상품관리]',{enableHTML: true});
          },
          (e: Error) => {
           // this.toastr.error(`상품 판매 변경 실패<br>ID: ${e.message}`, '[상품관리]', {enableHTML: true})
          }
        );
    };
    const clickedStop = () => {
      this.productBulkUpdater.updateProductsToStop()
        .subscribe(
          (successIds) => {
            this.productListComponent.getPagedList();
           // this.toastr.success(`상품 판매중지 변경 성공<br>ID: ${successIds.join(', ')}`, '[상품관리]', {enableHTML: true});
          },
          (e: Error) => {
            //this.toastr.error(`상품 판매중지 변경 실패<br>ID:${e.message}`, '[상품관리]',{enableHTML: true})
          }
        );
    };

    this.clickedHandler = {
      sell: clickedSell,
      stop: clickedStop
    };
  }
}
