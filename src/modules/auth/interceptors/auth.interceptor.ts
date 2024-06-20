import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, first, mergeMap, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.startsWith('api/sso')) return next(req);

  const authService = inject(AuthService);

  const nextWithToken = () =>
    next(req.clone({ setHeaders: { 'Authorization': authService.token() ?? '' } }));

  return authService.canMakeHttpRequests$
    .pipe(first(v => v))
    .pipe(mergeMap(nextWithToken))
    .pipe(catchError(e => {
      if (!(e instanceof HttpErrorResponse)) return of(e);

      const response = e as HttpErrorResponse;
      if (response.status !== 401) return of(e);

      if (!authService.canMakeHttpRequests$.value) {
        return authService.canMakeHttpRequests$
          .pipe(first(v => v))
          .pipe(mergeMap(nextWithToken))
      }

      authService.canMakeHttpRequests$.next(false);

      return authService.updateUser()
        .pipe(switchMap(nextWithToken));
    }));
};
