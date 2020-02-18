import { Component, OnInit, Inject } from '@angular/core';
import { Categories, Category } from '../category.model';
import { ActivatedRoute } from '@angular/router';
import { CAT_LIST_PAGE_SIZE } from '../category.tokens';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'scm-category-management',
  templateUrl: './category-managemnet.component.html',
  styleUrls: ['./category-managemnet.component.css']
})
export class CategoryManagementComponent implements OnInit {

  categories: Categories;
  totalItemCnt: number = 0;
  pageSize: number;
  pageNo: number = 1;

  constructor(private route: ActivatedRoute,
              private database: DataStoreService,
              @Inject(CAT_LIST_PAGE_SIZE) pageSize: number)  {
                this.pageSize = pageSize;
              }

  ngOnInit() {
    this.database.count('category').subscribe(cnt => this.totalItemCnt = cnt);
    this.fetchResolvedDate();
  }

  pageNoChanged(pageNo){
    this.pageSize = pageNo;
    this.getPagedList();
  }

  getPagedList() {
    this.database.findList$ByPage<Category>('category', this.pageNo, this.pageSize, this.totalItemCnt)
      .pipe(
       map(actions => actions.map(action => action.payload.val()))
      , tap((list: Categories) => list.sort((p1, p2) => p2.no - p1.no)))
      .subscribe(cats => this.categories = cats);
  }

  private fetchResolvedDate(){
    const resolvedData = <{ list: Categories }> this.route.snapshot.data;
    this.categories = resolvedData.list;
  }
}
