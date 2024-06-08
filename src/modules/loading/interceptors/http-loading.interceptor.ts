import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const service = inject(LoadingService);

  let wasRemoved = false;
  const remove = (): void => {
    if (wasRemoved) return;
    service.removeLoading();
    wasRemoved = true;
  };

  service.appendLoading();
  return next(req)
    .pipe(tap(v => v instanceof HttpResponse && remove()))
    .pipe(tap({ error: () => remove() }));
};
