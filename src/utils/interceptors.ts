import { HttpInterceptorFn, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '../modules/auth/interceptors/auth.interceptor';
import { httpErrorInterceptor } from '../interceptors/http-error.interceptor';
import { studyplaceInterceptor } from '../modules/studyplaces/interceptors/studyplace.interceptor';
import { httpLoadingInterceptor } from '../modules/loading/interceptors/http-loading.interceptor';

export const withDefaultInterceptors = (interceptorFns: HttpInterceptorFn[] = []) => {
  return withInterceptors([
    authInterceptor,
    httpErrorInterceptor,
    httpLoadingInterceptor,
    studyplaceInterceptor,
    ...interceptorFns,
  ]);
};