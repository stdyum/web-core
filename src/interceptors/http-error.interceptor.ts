import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(MatSnackBar);

  return next(req)
    .pipe(tap({
      error: (e: HttpErrorResponse) => {
        const message = e.error?.at(0)?.message ?? e.message;

        snackbar.open(message, undefined, {
          duration: 2500,
          panelClass: 'mat-error',
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      },
    }));
};
