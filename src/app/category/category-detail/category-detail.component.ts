import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionMode, ScmSharedUtil } from 'src/app/shared/scm-shared-util';
import { Category } from '../category.model';
import { filter, tap, switchMap, map } from 'rxjs/operators';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { CanComponentDeactivate } from 'src/app/shared/can-deactivate-guard.service';

@Component({
  selector: 'scm-category-detail',
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.css']
})
export class CategoryDetailComponent implements OnInit {

  subTitle: string;
  actionMode: ActionMode;
  categoryForm: FormGroup;
  private submitted = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private database: DataStoreService,
    private toastr: ToastrService,
    private fb: FormBuilder) {
    this.initform();
  }

  initform() {
    this.categoryForm = this.fb.group({

      no: [0],
      name: ['', Validators.required],
      desc: ['', Validators.compose([Validators.required, Validators.minLength(5),
      Validators.maxLength(100)])],
      isUse: [true, Validators.required],
      createdTime: [ScmSharedUtil.getCurrentDateTime()],
      updatedTime: [''],
    });
  }

  resetForm(cat: Category) {
    this.categoryForm.reset({
      no: { value: cat.no, disabled: true },
      name: { value: cat.name, disabled: true },
      desc: { value: cat.desc, disabled: true },
      isUse: { value: cat.isUse, disabled: true },
      createdTime: { value: cat.createdTime, disabled: true },
      updatedTime: { value: cat.updatedTime, disabled: true },
    });
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      filter(q => q['action'] !== undefined)
      , tap(q => this._setActionMode(q))
      , switchMap(q => this.route.data)
      , filter((data: { category: Category }) => data.category !== null)
      , map((data: { category: Category }) => data.category)
    ).subscribe(cat =>
      this.actionMode === 'read' ? this.resetForm(cat) : this.categoryForm.patchValue(cat)
    );
  }

  submit() {
    const category: Category = this.categoryForm.value;
    if (this.actionMode === 'create') {
      const categoryFn = (no) => {
        alert(no  + 'no');
        category.no = no;
        return category;
      };
      this.database.create('category', categoryFn).subscribe(this._onSuccess(), this._onError());
      return;
    }

    category.updatedTime = ScmSharedUtil.getCurrentDateTime();
    this.database.update('category', category).then(this._onSuccess(), this._onError());
  }

  cancle() {
    this.redirectToCategoryList();
  }

  private _setActionMode(q) {
    this.actionMode = q['action'];
    switch (this.actionMode) {
      case 'create':
        this.subTitle = '등록';
        break;
      case 'edit':
        this.subTitle = '수정';
        break;
      case 'read':
      default:
        this.subTitle = '조회';
    }
  }

  private redirectToCategoryList() {
    this.router.navigate(['category-list']);
  }

  private _onSuccess() {
    return () => {
      this.toastr.success(`카테고리 ${this.subTitle} 완료`, '[카테고리 관리]');
      this.redirectToCategoryList();
    };
  }

  private _onError() {
    return e => {
      this.toastr.error(`카테고리 ${this.subTitle} 실패`, '[카테고리 관리]');
      this.redirectToCategoryList();
    };
  }
}
