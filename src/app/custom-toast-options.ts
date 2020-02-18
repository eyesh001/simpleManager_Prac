import { ToastrService } from 'ngx-toastr';

export class CustomToastOptions extends ToastrService {
    enableHTML: true;
    positionClass: 'toast-top-center';
}
