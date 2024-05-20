import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../modules/auth/services/auth.service';
import { RedirectLinkDirective } from '../../modules/redirect/directives/redirect-link.directive';
import { SelectComponent } from '@likdan/form-builder-material/src/components';
import { map, Observable, tap } from 'rxjs';
import { ItemPaginationItem } from '@likdan/form-builder-material/components/pagination/items/models';
import { PaginationParams } from '../../modules/pagination/models/pagination.models';
import { AsyncPipe } from '@angular/common';
import { EnrollmentsService } from '../../modules/studyplaces/services/enrollments.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'st-header',
  standalone: true,
  imports: [
    MatButton,
    RedirectLinkDirective,
    SelectComponent,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  host: {
    class: 'primary-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  currentEnrollment = new FormControl<string | null>(null);

  private userService = inject(AuthService);
  private enrollmentsService = inject(EnrollmentsService);

  enrollments$ = this.enrollmentsService.loadUserEnrollmentsForSelectRedirectingToApplyIfNeeded();

  constructor() {
    this.subscribeToCurrentEnrollment();
  }

  get user() {
    return this.userService.user;
  }

  enrollmentsNext = (_: any, meta: any): Observable<ItemPaginationItem<PaginationParams>> =>
    this.enrollmentsService.loadUserEnrollmentsForSelect(meta)
      .pipe(map(v => v!));

  enrollmentsReload = (_: any): Observable<ItemPaginationItem<PaginationParams>> =>
    this.enrollmentsService.loadUserEnrollmentsForSelect()
      .pipe(map(v => v!));

  private subscribeToCurrentEnrollment(): void {
    effect(() => {
      const currentEnrollmentId = this.enrollmentsService.currentEnrollmentId();
      this.currentEnrollment.value !== currentEnrollmentId && this.currentEnrollment.setValue(currentEnrollmentId);
    });

    this.currentEnrollment.valueChanges
      .pipe(takeUntilDestroyed())
      .pipe(tap(v => this.enrollmentsService.currentEnrollmentId.set(v)))
      .subscribe();
  }
}
