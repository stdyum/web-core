import { effect, inject, signal, Signal } from '@angular/core';
import { EnrollmentsService } from '../services/enrollments.service';
import { HttpContext } from '@angular/common/http';
import { WITH_STUDYPLACE_ID } from '../interceptors/studyplace.interceptor';

export const rememberStudyPlaceId = <T>(func: (id: string) => T, initial: T | null = null): Signal<T | null> => {
  const currentStudyplaceId = inject(EnrollmentsService).currentStudyplaceId;

  const out = signal<T | null>(initial);

  effect(() => {
    const id = currentStudyplaceId();
    if (!id) return;

    out.set(func(id));
  }, {
    allowSignalWrites: true,
  });

  return out.asReadonly();
};

export const httpContextWithStudyPlace = (withStudyPlace: boolean = true, root: HttpContext = new HttpContext()): HttpContext =>
  root.set(WITH_STUDYPLACE_ID, withStudyPlace);
