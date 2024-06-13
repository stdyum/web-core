import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { RedirectService } from '../../redirect/services/redirect.service';
import { BehaviorSubject, finalize, Observable, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from '../dto/auth.response';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  canMakeHttpRequests$ = new BehaviorSubject<boolean>(false);

  private authResponse = signal<AuthResponse | null>(null);

  user = computed(() => this.authResponse()?.user);
  token = computed(() => this.authResponse()?.tokens.access);
  enrollmentId = computed(() => this.authResponse()?.enrollment?.id);
  language = computed(() => this.authResponse()?.language?.code);

  private injector = inject(Injector);
  private redirectService = inject(RedirectService);

  constructor() {
    setTimeout(this.loadUser.bind(this));
  }

  loadUser(): void {
    const http = this.injector.get(HttpClient);
    http.post<AuthResponse>('api/sso/v1/authorize', null)
      .pipe(take(1))
      .pipe(tap(this.authResponse.set.bind(this.authResponse)))
      .pipe(finalize(() => this.canMakeHttpRequests$.next(true)))
      .pipe(tap({ error: this.redirectToLandingIfNeeded.bind(this) }))
      .subscribe();
  }


  updateUser(): Observable<AuthResponse | null> {
    const http = this.injector.get(HttpClient);
    return http.post<AuthResponse>('api/sso/v1/update', null)
      .pipe(take(1))
      .pipe(tap(this.authResponse.set.bind(this.authResponse)))
      .pipe(tap(() => this.canMakeHttpRequests$.next(true)))
      .pipe(tap({ error: this.redirectToAuth.bind(this) }));
  }

  saveTokens(request: Params): Observable<void> {
    const http = this.injector.get(HttpClient);
    return http.post<void>('api/sso/v1/tokens', request)
      .pipe(take(1));
  }

  logout(): Observable<void> {
    const http = this.injector.get(HttpClient);
    return http.delete<void>('api/sso/v1/logout')
      .pipe(take(1));
  }

  private redirectToAuth(): void {
    this.redirectService.redirect('auth');
  }

  private redirectToLandingIfNeeded(): void {
    if (!this.shouldRedirectToLanding(window.location.hostname)) return;

    this.redirectService.redirect('landing');
  }

  private shouldRedirectToLanding(hostname: string): boolean {
    if (hostname.split('.').length < 2) {
      console.warn('unable to get host');
      return false;
    }

    return !hostname.startsWith('landing') && !hostname.startsWith('auth');
  }
}
