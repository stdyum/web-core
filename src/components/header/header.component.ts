import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../../modules/auth/services/auth.service';
import { RedirectLinkDirective } from '../../modules/redirect/directives/redirect-link.directive';
import { map, Observable, tap } from 'rxjs';
import { PaginationParams } from '../../modules/pagination/models/pagination.models';
import { AsyncPipe } from '@angular/common';
import { EnrollmentsService } from '../../modules/studyplaces/services/enrollments.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RedirectService } from '../../modules/redirect/services/redirect.service';
import { TranslationService } from '../../modules/translation/service/translation.service';
import { TranslationPipe } from '../../modules/translation/pipes/translation.pipe';
import { SelectComponent } from '@likdan/form-builder-material/controls/components/selects/select';
import { ItemPaginationItem } from '@likdan/form-builder-material/pagination';

@Component({
  selector: 'st-header',
  standalone: true,
  imports: [
    MatButton,
    RedirectLinkDirective,
    SelectComponent,
    AsyncPipe,
    ReactiveFormsModule,
    TranslationPipe,
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
  languages = [
    { display: 'Русский', value: 'ru-ru' },
    { display: 'English', value: 'en-us' },
  ];
  private userService = inject(AuthService);
  private enrollmentsService = inject(EnrollmentsService);
  enrollments$ = this.enrollmentsService.loadUserEnrollmentsForSelectRedirectingToApplyIfNeeded();

  private redirect = inject(RedirectService);
  private translationService = inject(TranslationService);
  currentLanguage = new FormControl<string | null>(this.translationService.currentLanguage());

  constructor() {
    this.subscribeToCurrentEnrollment();
    this.subscribeToCurrentLanguage();
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

  logout(): void {
    this.userService.logout()
      .subscribe(() => this.redirect.redirect());
  }

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

  private subscribeToCurrentLanguage(): void {
    effect(() => {
      const currentLanguage = this.translationService.currentLanguage();
      this.currentLanguage.value !== currentLanguage && this.currentLanguage.setValue(currentLanguage);
    });

    this.currentLanguage.valueChanges
      .pipe(takeUntilDestroyed())
      .pipe(tap(v => this.translationService.set(v ?? 'en-us')))
      .subscribe();
  }
}
