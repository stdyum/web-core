import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginationParams } from '../../pagination/models/pagination.models';
import { filter, finalize, map, merge, Observable, take, tap } from 'rxjs';
import { Enrollment, EnrollmentPagination } from '../models/enrollments.models';
import { Item, ItemPaginationItem } from '@likdan/form-builder-material/components/pagination/items/models';
import { RedirectService } from '../../redirect/services/redirect.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { State } from '@likdan/state-mapper';
import { AuthService } from '../../auth/services/auth.service';

export type EnrollmentState = State<Enrollment>

@Injectable({
  providedIn: 'root',
})
export class EnrollmentsService {
  currentEnrollmentId = signal<string | null>(null);
  currentEnrollment = signal<Enrollment | null>(null);
  currentEnrollmentLoading = signal<boolean>(true);

  currentStudyplaceId = computed(() => this.currentEnrollment()?.studyPlaceId ?? null);

  currentEnrollmentState = merge(
    toObservable(this.currentEnrollment)
      .pipe(filter(v => !!v))
      .pipe(map(v => <EnrollmentState>{ state: 'loaded', data: v })),
    toObservable(this.currentEnrollmentLoading)
      .pipe(filter(v => v))
      .pipe(map(() => <EnrollmentState>{ state: 'loading' })),
  );

  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private redirect = inject(RedirectService);

  constructor() {
    effect(() => {
      const enrollmentId = this.auth.enrollmentId();
      this.currentEnrollmentId.set(enrollmentId ?? null);
    }, {
      allowSignalWrites: true,
    });

    effect(() => {
      const enrollmentId = this.currentEnrollmentId();
      enrollmentId && this.setDefaultEnrollmentId(enrollmentId);
      enrollmentId && this.getEnrollmentByIdSubscribe(enrollmentId);
    }, {
      allowSignalWrites: true,
    });
  }

  loadUserEnrollments(params: PaginationParams | null = null): Observable<EnrollmentPagination | null> {
    return this.http.get<EnrollmentPagination>('api/studyplaces/v1/enrollments', { params: params ?? {} })
      .pipe(tap(e => this.currentEnrollmentId() || this.currentEnrollmentId.set(e?.items?.at(0)?.id ?? null)));
  }

  loadUserEnrollmentsForSelect(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.loadUserEnrollments(params)
      .pipe(map(this.mapEnrollmentsToSelectPagination.bind(this)));
  }

  loadUserEnrollmentsForSelectRedirectingToApplyIfNeeded(params: PaginationParams | null = null): Observable<ItemPaginationItem<PaginationParams> | null> {
    return this.loadUserEnrollments(params)
      .pipe(tap({
        next: this.redirectToApplyIfNeeded.bind(this),
        error: () => this.redirectToApplyIfNeeded(null),
      }))
      .pipe(map(this.mapEnrollmentsToSelectPagination.bind(this)));
  }

  getEnrollmentById(id: string): Observable<Enrollment> {
    return this.http.get<Enrollment>(`api/studyplaces/v1/enrollments/${id}`);
  }

  getEnrollmentByIdSubscribe(id: string): void {
    this.currentEnrollmentLoading.set(true);
    this.getEnrollmentById(id)
      .pipe(take(1))
      .pipe(finalize(() => this.currentEnrollmentLoading.set(false)))
      .subscribe(this.currentEnrollment.set.bind(this.currentEnrollment));
  }

  setDefaultEnrollmentId(id: string): void {
    this.http.post('api/sso/v1/defaults/enrollment', { id: id })
      .pipe(take(1))
      .subscribe();
  }

  private mapEnrollmentsToSelectPagination(enrollments: EnrollmentPagination | null): ItemPaginationItem<PaginationParams> | null {
    if (!enrollments) return null;

    return {
      items: enrollments.items.map(v => <Item>{
        value: v.id,
        display: v.studyPlaceTitle,
      }),
      hasNext: !!enrollments.next,
      meta: enrollments.next,
    };
  }

  private redirectToApplyIfNeeded(enrollments: EnrollmentPagination | null): void {
    if (enrollments && enrollments.items && enrollments.items.length > 0) return;

    this.redirect.redirect('auth', 'apply');
  }
}
