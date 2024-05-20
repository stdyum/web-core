import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EnrollmentsService } from '../services/enrollments.service';
import { filter, map, switchMap, takeWhile, tap } from 'rxjs';
import { LoadedState } from '@likdan/state-mapper';
import { Enrollment } from '../models/enrollments.models';

export const WITH_STUDYPLACE_ID = new HttpContextToken<boolean>(() => false);

export const studyplaceInterceptor: HttpInterceptorFn = (req, next) => {
  const withStudyPlaceIdValue = req.context.get(WITH_STUDYPLACE_ID);
  if (!withStudyPlaceIdValue) return next(req);

  const service = inject(EnrollmentsService);
  return service.currentEnrollmentState
    .pipe(filter(s => s.state === 'loaded'))
    .pipe(map(s => (s as LoadedState<Enrollment>).data.studyPlaceId))
    .pipe(switchMap(id => next(req.clone({ setHeaders: { 'Study-Place-Id': id } }))));
};
