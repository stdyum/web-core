import { computed, effect, inject, Injectable, Signal, signal } from '@angular/core';
import { Translation } from '../models/translation';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  all = signal<{ [lang: string]: Translation }>({});
  currentLanguage = signal<string | null>(null);

  current = computed(() => this.all()[this.currentLanguage() ?? ''] ?? {});

  private http = inject(HttpClient);
  private auth = inject(AuthService);

  constructor() {
    effect(() => {
      const language = this.auth.language();
      this.currentLanguage.set(language || 'en-us');
    }, {
      allowSignalWrites: true,
    });

    effect(() => {
      const language = this.currentLanguage();
      language && !this.all()[language] && this.load(language).subscribe();
      language && (this.auth.language() || this.auth.language() === "") && this.setDefaultLanguage(language);
    }, {
      allowSignalWrites: true,
    });
  }

  setDefaultLanguage(code: string): void {
    this.http.post('api/sso/v1/defaults/language', { code: code })
      .pipe(take(1))
      .subscribe();
  }

  load(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/i18n/${lang}.json`)
      .pipe(take(1))
      .pipe(tap(t => this.all.update(a => {
        a[lang] = t;
        return { ...a };
      })));
  }

  getTranslation(key: string): Signal<string> {
    return computed(() => this.current()[key] ?? key);
  }

  set(lang: string): void {
    if (!lang) return
    this.currentLanguage.set(lang);
  }
}
